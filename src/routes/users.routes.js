import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '#controllers/users.controller.js';
import { authenticate, authorize, checkOwnershipOrAdmin } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

// Get all users - requires authentication and admin role
router.get('/', authenticate, authorize('admin'), fetchAllUsers);

// Get user by ID - requires authentication and ownership or admin role
router.get('/:id', authenticate, checkOwnershipOrAdmin, fetchUserById);

// Update user - requires authentication and ownership or admin role
router.put('/:id', authenticate, updateUserById);

// Delete user - requires authentication and admin role
router.delete('/:id', authenticate, authorize('admin'), deleteUserById);


export default router;