import express from 'express';
import {body} from 'express-validator';
import {
    getClients,
    getClientById,
    registerClient,
} from '../controllers/clientController.js';  
import validate from '../middlewares/validation.js';

const router = express.Router();

router.get('/customers',getClients);
router.get('/customers/:id',getClientById);
router.post('/customers',[
  body("name")
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Display name must contain only letters, numbers and spaces")
      .trim(),
  body("phoneOrEmail")
    .notEmpty()
    .withMessage("Email o teléfono es requerido")
    .trim()
    .custom((value) => {
      const emailRegex = /^\S+@\S+\.\S+$/;
      const phoneRegex = /^\+\d{10,15}$/;
      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        throw new Error('Debe ser un email válido o un teléfono con formato +1234567890');
      }
      return true;
    }),  
],validate,registerClient);

export default router;