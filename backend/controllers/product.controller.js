import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, inventory } = req.body;

    // Upload product image to Cloudinary
    const photo = req.file.path;
    const uploadedResponse = await cloudinary.uploader.upload(photo, {
      folder: 'products',
    });

    // Create product in the database
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),  // Ensure price is an integer
        image: uploadedResponse.secure_url,  // Store Cloudinary image URL
        inventory: parseInt(inventory),
        category,
      },
    });

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Product creation failed', error });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

// Update product details
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, inventory } = req.body;

  try {
    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If a new image is uploaded, upload to Cloudinary
    let updatedImage = product.image;
    if (req.file) {
      const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products',
      });
      updatedImage = uploadedResponse.secure_url;
    }

    // Update product in the database
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name || product.name,
        description: description || product.description,
        price: price ? parseInt(price) : product.price,
        category: category || product.category,
        inventory: inventory ? parseInt(inventory) : product.inventory,
        image: updatedImage,
      },
    });

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Product update failed', error });
  }
};
