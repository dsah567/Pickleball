import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';  


const prisma = new PrismaClient();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const signup = async (req, res) => {
  try {
    const { name, email, password, location, skillLevel } = req.body;
    console.log( name, email, password, location, skillLevel);

    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    
    const photo = req?.file?.path;
    let uploadedResponse
    if(photo){

        uploadedResponse = await cloudinary.uploader.upload(photo, {
            folder: 'user_profiles',
        });
    }
    console.log( uploadedResponse);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
console.log(hashedPassword);
    console.log( name,email,password,location,skillLevel, uploadedResponse?.secure_url || null ,);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        location,
        skillLevel,
        profilePhoto: uploadedResponse?.secure_url || "null" , // Store Cloudinary image link
      },
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Signup failed', error });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ userId: user }, process.env.JWT_SECRET, { expiresIn: '24h' });

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

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId;  // This will come from auth middleware

    const { name, location, skillLevel } = req.body;
    let profilePhoto;

    // If there's a new photo, upload it to Cloudinary
    if (req.file) {
      const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles',
      });
      profilePhoto = uploadedResponse.secure_url;
    }

    // Update user info
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        location,
        skillLevel,
        profilePhoto: profilePhoto || undefined,
      },
    });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error });
  }
};
