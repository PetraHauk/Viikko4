import express from 'express';
import catRouter from './routers/cat-router.js';
import userRouter from './routers/user-router.js';
import authRouter from './routers/auth-router.js';

const router = express.Router();

// bind base url for all cat routes to catRouter
router.use('/cats', catRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
