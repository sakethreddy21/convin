import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Middleware to authenticate the user
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { [key: string]: any };

    // Attach the decoded payload (user data) to the request body
    req.body.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Return an error response if the token is invalid
    return res.status(400).json({ error: 'Invalid token.' });
  }
};
