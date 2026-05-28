import { Router } from "express";
import prisma from "../config/db";
import { authenticateJWT, requireAdmin } from "../middleware/auth";

const router = Router();

// Validate Coupon
router.get("/validate/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const { subtotal } = req.query;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: "Coupon is inactive" });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    if (subtotal && parseFloat(subtotal as string) < coupon.minOrderAmount) {
      return res.status(400).json({
        error: `Minimum order amount of PKR ${coupon.minOrderAmount} required`,
      });
    }

    res.json({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all coupons (Admin)
router.get("/", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(coupons);
  } catch (error) {
    console.error("Get coupons error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create coupon (Admin)
router.post("/", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { code, type, value, minOrderAmount, expiryDate } = req.body;

    if (!code || !type || value === undefined || !expiryDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (type !== "PERCENTAGE" && type !== "FIXED") {
      return res.status(400).json({ error: "Invalid coupon type" });
    }

    const existing = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: parseFloat(value),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
        expiryDate: new Date(expiryDate),
      },
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE coupon (Admin)
router.delete("/:id", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    await prisma.coupon.delete({ where: { id } });

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
