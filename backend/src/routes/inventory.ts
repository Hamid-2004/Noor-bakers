import { Router } from "express";
import prisma from "../config/db";
import { authenticateJWT, requireAdmin } from "../middleware/auth";

const router = Router();

// GET all inventory logs (Admin)
router.get("/logs", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const logs = await prisma.inventoryLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            name: true,
            image: true,
            stock: true,
          },
        },
      },
    });
    res.json(logs);
  } catch (error) {
    console.error("Get inventory logs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST restock (Admin)
router.post("/restock", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { productId, changeAmount, notes } = req.body;

    if (!productId || changeAmount === undefined || parseInt(changeAmount) === 0) {
      return res.status(400).json({ error: "Product ID and non-zero change amount are required" });
    }

    const amount = parseInt(changeAmount);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Ensure stock doesn't go below 0
    if (product.stock + amount < 0) {
      return res.status(400).json({ error: `Cannot adjust stock below 0. Current stock is ${product.stock}` });
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id: productId },
        data: { stock: { increment: amount } },
      });

      await tx.inventoryLog.create({
        data: {
          productId,
          changeAmount: amount,
          type: amount > 0 ? "RESTOCK" : "ADJUSTMENT",
          notes: notes || `Manual stock adjustment of ${amount}`,
        },
      });

      return updated;
    });

    res.json({
      message: "Inventory updated successfully",
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        stock: updatedProduct.stock,
      },
    });
  } catch (error) {
    console.error("Restock error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
