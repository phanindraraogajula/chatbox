const prisma = require('../db');
const bcrypt = require('bcrypt'); // if using
const jwt = require('jsonwebtoken'); // if using

// REGISTER
const register = async (req, res) => {
    try {
      const { userId, firstName, lastName, password } = req.body;
  
      // Validate required fields
      if (!userId || !password) {
        return res.status(400).json({ error: "userId and password are required" });
      }
  
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { userId }
      });
  
      if (existingUser) {
        return res.status(400).json({ error: "UserId already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const newUser = await prisma.user.create({
        data: {
          userId,
          firstName: firstName || null,
          lastName: lastName || null,
          password: hashedPassword,
          friends: [] // default empty list
        }
      });
  
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          userId: newUser.userId
        }
      });
  
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ error: "Server error" });
    }
  };

// LOGIN
const login = async (req, res) => {
    try {
      const { userId, password } = req.body;
  
      if (!userId || !password) {
        return res.status(400).json({ error: "userId and password are required" });
      }
  
      // Find user by userId
      const user = await prisma.user.findUnique({
        where: { userId },
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
      }
  
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
  
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  };

module.exports = { register, login };
