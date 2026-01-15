import express from 'express';
import {
  deleteUser,
  getUsers,
  getUsersById,
  updateUser,
} from '#controllers/users.controller.js';
import { authenticate } from '#middleware/auth.middleware.js';
import { authorize } from '#middleware/authorize.middleware.js';
import { authorizeselfMiddleware } from '#middleware/authorizeself.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'),getUsers);
router.get('/:id', authenticate,authorizeselfMiddleware,getUsersById);
router.patch('/:id', authenticate,authorizeselfMiddleware,updateUser);
router.delete('/:id', authenticate,authorize('admin'),deleteUser);

export default router;