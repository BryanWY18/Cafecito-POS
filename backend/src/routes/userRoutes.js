import express from 'express';
import { body,param,query } from "express-validator";
import validate from '../middlewares/validation.js';
import {
  getUserProfile,
  createUser,
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
  searchUsers
} from '../controllers/userController.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const profileValidations= [
  body("displayName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Display name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("Display name must contain only letters, numbers and spaces")
    .trim(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];

router.get('/profile',authMiddleware,getUserProfile);
router.get('/all-users',authMiddleware,getAllUsers);
router.post('/register',
  [
    body("displayName")
      .notEmpty().withMessage("Display name is required")
      .isLength({ min: 2, max: 50 }).withMessage("Display name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("Display name must contain only letters, numbers and spaces")
      .trim(),
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .matches(/[a-zA-Z]/).withMessage("Password must contain at least one letter"),
    body("role")
      .optional()
      .isIn(["admin", "seller"]).withMessage("Role must be admin or seller"),
  ],
  validate,authMiddleware,isAdmin,createUser);
router.delete('/:id',authMiddleware,isAdmin,deleteUser)

export default router;