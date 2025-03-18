// routes/userRoutes.js

import express from 'express';
const router = express.Router();
import UserController from '../controllers/UserController.js';
import authenticateToken from '../middleware/authenticateToken.js';

// Route for user registration
router.post('/register', UserController.register);


// Route for user login
router.post('/login', UserController.login);

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route.', user: req.user });
});

export default router;
