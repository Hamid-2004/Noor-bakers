import { Router } from "express";
import prisma from "../config/db";
import { authenticateJWT, requireAdmin, AuthRequest } from "../middleware/auth";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from "../services/email";

const router = Router();

// Create Order (Guest or Customer)
router.post("/", async (req: AuthRequest, res) => {
  try {
    const { name, phone, address, city, area, notes, items, couponCode, userId } = req.body;

    if (!name || !phone || !address || !city || !area || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required order information" });
    }

    // Begin a prisma transaction to ensure atomic stock subtraction and order placement
    const newOrder = await prisma.$transaction(async (tx) => {
      let subtotal = 0;

      // 1. Validate stocks and compute subtotal
      const itemsToCreate = [];
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) {
          throw new Error(`Product with ID ${item.id} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }

        subtotal += product.price * item.quantity;
        itemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 2. Coupon Validation (if code provided)
      let discountAmount = 0;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
        if (coupon && coupon.isActive && new Date(coupon.expiryDate) > new Date() && subtotal >= coupon.minOrderAmount) {
          if (coupon.type === "PERCENTAGE") {
            discountAmount = (subtotal * coupon.value) / 100;
          } else if (coupon.type === "FIXED") {
            discountAmount = coupon.value;
          }
          // Cap discount to subtotal
          discountAmount = Math.min(discountAmount, subtotal);
        }
      }

      const deliveryFee = 150;
      const total = subtotal + deliveryFee - discountAmount;

      // 3. Decrement stock and log inventory
      for (const item of itemsToCreate) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            changeAmount: -item.quantity,
            type: "SALE",
            notes: `Stock decremented due to order placement`,
          },
        });
      }

      // 4. Create Order
      const order = await tx.order.create({
        data: {
          userId: userId || null,
          name,
          phone,
          address,
          city,
          area,
          notes,
          subtotal,
          deliveryFee,
          discountAmount,
          total,
          couponCode,
          items: {
            create: itemsToCreate.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return order;
    });

    // Send confirmation email
    let userEmail = "";
    if (userId) {
      const userObj = await prisma.user.findUnique({ where: { id: userId } });
      userEmail = userObj?.email || "";
    }
    if (userEmail) {
      sendOrderConfirmationEmail(userEmail, newOrder);
    }

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error("Create order transaction error:", error);
    res.status(400).json({ error: error.message || "Could not place order" });
  }
});

// GET user orders (Customer history)
router.get("/my-orders", authenticateJWT, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all orders (Admin)
router.get("/", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Get admin orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update status (Admin)
router.put("/:id/status", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Send status email
    let userEmail = "";
    if (order.userId) {
      const userObj = await prisma.user.findUnique({ where: { id: order.userId } });
      userEmail = userObj?.email || "";
    }
    if (userEmail) {
      sendOrderStatusUpdateEmail(userEmail, order);
    }

    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
