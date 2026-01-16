import express from 'express';
import { getSales, getSaleById, createSale} from '../controllers/salesController.js';

const router = express.Router();

router.get('/sales',getSales);
router.get('/sales/:id',getSaleById);
router.post('/sales',createSale)

export default router;