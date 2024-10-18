import express from 'express';
import { signin, logout} from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/signin', signin);
router.post('/logout', authMiddleware, logout);

export default router;