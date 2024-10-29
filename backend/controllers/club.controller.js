import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const signup = async (req, res) => {
    try {
      const { name,email,password, address, contactInfo, membershipPrice } = req.body;
      
      const existingUser = await prisma.club.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'club already exists' });
  
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
  
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          address,
          contactInfo,
          membershipPrice
        },
      });
  
      res.status(201).json({ message: 'club created successfully', club: newUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Signup failed', error });
    }
  };
  
// Club Login Controller
export const clubLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const club = await prisma.club.findUnique({
      where: { email }
    });

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, club.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: club.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('clubToken', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', club });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

// Club Profile Update Controller
export const updateClubProfile = async (req, res) => {
  const { clubId } = req.params;
  const { name, address, contactInfo, membershipPrice } = req.body;

  try {
    const updatedClub = await prisma.club.update({
      where: { id: parseInt(clubId) },
      data: { name, address, contactInfo, membershipPrice }
    });

    res.status(200).json({ message: 'Club profile updated', updatedClub });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error });
  }
};

// Club Logout Controller
export const clubLogout = async (req, res) => {
  res.cookie('clubToken', '', { expires: new Date(0), httpOnly: true });
  res.status(200).json({ message: 'Logout successful' });
};

// View Club Members
export const viewClubMembers = async (req, res) => {
  const { clubId } = req.params;

  try {
    const members = await prisma.membership.findMany({
      where: { clubId: parseInt(clubId) },
      include: { user: true } // Include user details
    });

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members', error });
  }
};
