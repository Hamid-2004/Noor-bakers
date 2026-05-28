import { Router } from "express";
import prisma from "../config/db";
import { authenticateJWT, requireAdmin } from "../middleware/auth";

const router = Router();

// GET all (with optional category filter)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category && category !== "all") {
      filter = { category: { slug: category as string } };
    }

    const products = await prisma.product.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET featured
router.get("/featured", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product by slug error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create
router.post("/", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { name, slug, image, categoryId, price, stock, description, featured } = req.body;

    if (!name || !slug || !categoryId || price === undefined || stock === undefined || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      return res.status(400).json({ error: "Product slug must be unique" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        image: image || "/products/placeholder.svg",
        categoryId,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
        featured: !!featured,
      },
      include: { category: true }
    });

    // Create initial restock inventory log
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        changeAmount: product.stock,
        type: "RESTOCK",
        notes: "Initial inventory setup on creation"
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update
router.put("/:id", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, image, categoryId, price, stock, description, featured } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.product.findUnique({ where: { slug } });
      if (duplicateSlug) {
        return res.status(400).json({ error: "Product slug must be unique" });
      }
    }

    // Determine stock difference to log inventory changes
    let stockChange = 0;
    if (stock !== undefined) {
      const newStock = parseInt(stock);
      stockChange = newStock - existing.stock;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        slug: slug !== undefined ? slug : existing.slug,
        image: image !== undefined ? image : existing.image,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        price: price !== undefined ? parseFloat(price) : existing.price,
        stock: stock !== undefined ? parseInt(stock) : existing.stock,
        description: description !== undefined ? description : existing.description,
        featured: featured !== undefined ? !!featured : existing.featured,
      },
      include: { category: true }
    });

    // Create log if stock was adjusted
    if (stockChange !== 0) {
      await prisma.inventoryLog.create({
        data: {
          productId: product.id,
          changeAmount: stockChange,
          type: "ADJUSTMENT",
          notes: `Stock adjusted manually from ${existing.stock} to ${product.stock}`
        }
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE delete
router.delete("/:id", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
