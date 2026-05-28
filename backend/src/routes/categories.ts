import { Router } from "express";
import prisma from "../config/db";
import { authenticateJWT, requireAdmin } from "../middleware/auth";

const router = Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } }
    });
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create
router.post("/", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { name, slug, image } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: "Name and slug are required" });
    }

    const existingCategory = await prisma.category.findUnique({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({ error: "Category slug must be unique" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: image || "/categories/placeholder.svg",
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update
router.put("/:id", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, image } = req.body;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.category.findUnique({ where: { slug } });
      if (duplicateSlug) {
        return res.status(400).json({ error: "Category slug must be unique" });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        slug: slug !== undefined ? slug : existing.slug,
        image: image !== undefined ? image : existing.image,
      },
    });

    res.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE delete
router.delete("/:id", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    await prisma.category.delete({ where: { id } });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
