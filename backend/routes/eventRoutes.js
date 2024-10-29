import express from 'express';
import { createEvent, updateEvent, viewEvent, purchaseEvent } from '../controllers/event.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';  

const eventRouter = express.Router();

eventRouter.post('/create', authMiddleware, createEvent);  // Create a new event
eventRouter.put('/update/:eventId', authMiddleware, updateEvent);  // Update an event
eventRouter.get('/view/:eventId', viewEvent);  // View a specific event
eventRouter.post('/purchase', authMiddleware, purchaseEvent);  // Purchase an event

export default eventRouter;
