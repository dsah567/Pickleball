import express from 'express';
import { addProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product.controller.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';

const productRouter = express.Router();

// Routes for products
productRouter.post('/add', uploadMiddleware.single('image'), addProduct);  // Add a new product
productRouter.get('/', getAllProducts);  // Get all products
productRouter.get('/:id', getProductById);  // Get a single product by ID
productRouter.put('/update/:id', uploadMiddleware.single('image'), updateProduct);  // Update a product

export default productRouter;
