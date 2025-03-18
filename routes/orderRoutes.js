// routes/orderRoutes.js
import express from 'express';
import OrderController from '../controllers/OrderController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Create new order (ต้องใช้ token)
router.post('/create', authenticateToken, OrderController.create);

// Get orders by user ID (ต้องใช้ token)
router.get('/user-orders', authenticateToken, OrderController.getByUser);

export default router;
