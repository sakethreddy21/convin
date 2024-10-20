import express from 'express';
import { deleteUser, updateUser, getUser, createUser } from '../controllers/userController';
const router = express.Router();

// Create a new user
router.post('/', createUser);

// Delete a user
router.delete('/:userId', deleteUser);

// Update a user
router.put('/:userId', updateUser);

// Get a user
router.post('/login', getUser);



export default router;
