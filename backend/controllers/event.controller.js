import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// Create Event
export const createEvent = async (req, res) => {
  const { name, date, time, location, clubId, price } = req.body;

  try {
    const newEvent = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        time,
        location,
        clubId: parseInt(clubId),
        price: parseInt(price),
      }
    });

    res.status(201).json({ message: 'Event created successfully', newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { name, date, time, location, price } = req.body;

  try {
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: { name, date: new Date(date), time, location, price: parseInt(price) }
    });

    res.status(200).json({ message: 'Event updated', updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error });
  }
};

// View Event
export const viewEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: { club: true }
    });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error });
  }
};

// Purchase Event
export const purchaseEvent = async (req, res) => {
  const { userId, eventId, price } = req.body;

  try {
    const newPurchase = await prisma.eventPurchase.create({
      data: {
        userId: parseInt(userId),
        eventId: parseInt(eventId),
        price: parseInt(price),
        purchaseDate: new Date(),
      }
    });

    res.status(201).json({ message: 'Event purchased successfully', purchase: newPurchase });
  } catch (error) {
    res.status(500).json({ message: 'Event purchase failed', error });
  }
};
