const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// สร้างสินค้าใหม่
const createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !price) {
    return res
      .status(400)
      .json({ error: "Product name and price are required." });
  }
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price), // ตรวจสอบให้แน่ใจว่าเป็นตัวเลข
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    // ตรวจสอบ Unique constraint violation (ถ้า name ซ้ำ)
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return res
        .status(409)
        .json({ error: "Product with this name already exists." });
    }
    res.status(500).json({ error: "Failed to create product." });
  }
};

// ดึงสินค้าทั้งหมด
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to retrieve products." });
  }
};

// ดึงสินค้าตาม ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Failed to retrieve product." });
  }
};

// อัปเดตสินค้า
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined, // อัปเดตเฉพาะถ้ามีค่า
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.code === "P2025") {
      // Record not found
      return res.status(404).json({ message: "Product not found for update." });
    }
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return res
        .status(409)
        .json({ error: "Product with this name already exists." });
    }
    res.status(500).json({ error: "Failed to update product." });
  }
};

// ลบสินค้า
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error.code === "P2025") {
      // Record not found
      return res
        .status(404)
        .json({ message: "Product not found for deletion." });
    }
    res.status(500).json({ error: "Failed to delete product." });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
