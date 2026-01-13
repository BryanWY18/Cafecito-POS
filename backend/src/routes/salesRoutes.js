import express from 'express';
import { getSells, getSellById, createSale } from '../controllers/salesController.js';

const router = express.Router();

router.get('/sales',getSells);
router.get('/sales/:id',getSellById);
router.post('/sales',createSale)

export default router;