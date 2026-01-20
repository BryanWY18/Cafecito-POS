import express from 'express';
import {query} from 'express-validator';
import {
  getProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';
import validate from '../middlewares/validation.js';

const router = express.Router();

router.get('/products',getProducts);
router.get('/products/:id',getProductById);
router.get('/products/',[
  query('q').optional().isString().trim().isLength({min:1,max:100}).withMessage('El término de búsqueda debe tener entre 1 y 100 caracteres'),
  query('page').optional().isInt({min: 1}).withMessage('este campo debe ser un numero positivo'),
  query('limit').optional().isInt({min: 1}).withMessage('este campo debe ser un numero positivo'),
  ],validate,searchProducts);
router.post('/products',authMiddleware,isAdmin,createProduct);
router.put('/products/:id',authMiddleware,isAdmin,updateProduct);
router.delete('/products/:id',authMiddleware,isAdmin,deleteProduct);

export default router;