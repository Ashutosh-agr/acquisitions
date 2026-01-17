import express from 'express';
import { signIn, signOut, signUp } from '#controllers/auth.controller.js';
import { authenticate } from '#middleware/auth.middleware.js';

const router = express.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.post('/sign-out', authenticate, signOut);

export default router;
