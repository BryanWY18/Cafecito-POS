import express from 'express';

import customRoutes from './customersRoutes.js';
import salesRoutes from './salesRoutes.js';
import productRoutes from './productRoutes.js';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use(productRoutes);
router.use(salesRoutes);
router.use(customRoutes);
router.use('/users',userRoutes);
router.use('/auth',authRoutes);

export default router;