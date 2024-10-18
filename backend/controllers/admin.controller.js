import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';  


const prisma = new PrismaClient();

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find Admin by email
    const admin = await prisma.admistration.findUnique({ where: { email } });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    // Compare password
    const isMatch = (password ==admin.password) ? true :false 
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ userId: admin }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Send token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    });

    res.status(200).json({ message: 'Signin successful' });
  } catch (error) {
    res.status(500).json({ message: 'Signin failed', error });
  }
};

export const logout = (req, res) => {
  // Clear the token from cookies
  res.cookie('token', '', {  
    httpOnly: true,
    secure: true, 
    sameSite: 'none',
    maxAge: 1 });
  res.status(200).json({ message: 'Logout successful' });
};
