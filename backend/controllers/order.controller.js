import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// Purchase Controller - Create a new order
export const purchaseOrder = async (req, res) => {
  const { userId, products, totalAmount, shippingAddress } = req.body;

  try {
    // Create a new order
    const newOrder = await prisma.order.create({
      data: {
        user: {
          connect: { id: userId },  // Connect the order to the user
        },
        orderDate: new Date(),
        totalAmount: parseInt(totalAmount),
        shippingAddress,
        products: {
          create: products.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
            price: product.price,
          })),
        },
      },
    });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Order placement failed', error });
  }
};

// View all orders for a specific user
export const viewOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        products: true,
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status to 'cancelled'
    const cancelledOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: 'cancelled' },
    });

    res.status(200).json({ message: 'Order cancelled successfully', order: cancelledOrder });
  } catch (error) {
    res.status(500).json({ message: 'Order cancellation failed', error });
  }
};
