import express from 'express';
import { signup, signin, logout, updateUser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Routes
router.post('/signup', uploadMiddleware.single('profilePhoto'), signup);
router.post('/signin', signin);
router.post('/logout', authMiddleware, logout);
router.put('/update', authMiddleware, uploadMiddleware.single('profilePhoto'), updateUser);

export default router;
