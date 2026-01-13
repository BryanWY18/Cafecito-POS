import express from 'express';
import { body,param,query } from "express-validator";
import validate from '../middlewares/validation';
import {
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUserProfile,
  changePassword,
  updateUser,
  deactivateUser,
  toggleUserStatus,
  deleteUser,
  searchUsers
} from '../controllers/userController.js';
import isAdmin from '../middlewares/isAdminMiddleware';
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
