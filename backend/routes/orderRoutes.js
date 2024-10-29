import express from 'express';
import { purchaseOrder, viewOrders, cancelOrder } from '../controllers/order.controller.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

const orderRouter = express.Router();

// Routes for orders
orderRouter.post('/purchase', authMiddleware, purchaseOrder);  // Place an order
orderRouter.get('/:userId', authMiddleware, viewOrders);  // View all orders for a user
orderRouter.put('/cancel/:orderId', authMiddleware, cancelOrder);  // Cancel an order

export default orderRouter;
