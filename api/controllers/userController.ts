import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import Joi from 'joi'; // Import Joi for validation

const JWT_SECRET = 'your_jwt_secret'; 

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Mobile number must be 10 digits long',
  }),
});

export async function createUser(req: Request, res: Response) {  
  const { name, email, mobile } = req.body;

  // Validate request body against schema
  const { error } = userSchema.validate({ name, email, mobile });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newUser = new User({
      name,
      email,
      mobile,
    });

    
    await newUser.save();

    // Send a response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteUser(req: Request, res: Response) {
    const { userId } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }


  export async function updateUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { name, email, mobile } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the fields if provided
      if (name) user.name = name;
     
      if (email) user.email = email;

      if(mobile) user.mobile= mobile
    
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
 

  export async function getUser(req: Request, res: Response) {
    const { email, mobile } = req.body;
  

    if (!email || !mobile) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
   
      // Create the payload for the JWT token
      const payload = {
        email: user.email,
        name: user.name,
        userID: user._id
      };
  
      // Generate the JWT token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
      
      res.status(200).json({ token });
    } catch (err) {
      
      console.error(err); // Log the error for debugging
      res.status(500).json({ error: 'Server error' });
    }
  }