import { Router } from 'express';
import { 
  login, register, logout, profile } from '../controllers/AuthController.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);


export default router;