import express from 'express';
import { signup, clubLogin, updateClubProfile, clubLogout, viewClubMembers } from '../controllers/club.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js'; 
const clubRouter = express.Router();


clubRouter.post('/signup', signup);  // Club login
clubRouter.post('/login', clubLogin);  // Club login
clubRouter.put('/update/:clubId', authMiddleware, updateClubProfile);  // Update club profile
clubRouter.post('/logout', authMiddleware, clubLogout);  // Club logout
clubRouter.get('/members/:clubId', authMiddleware, viewClubMembers);  // View club members

export default clubRouter;
