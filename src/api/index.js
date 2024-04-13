import express from 'express';
import catRouter from './routes/cat-router.js';

const router = express.Router();

// bind base url for all cat routes to catRouter
router.use('/cats', catRouter);

export default router;
