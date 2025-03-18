import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import TransactionController from '../controllers/TransactionController.js';

const router = express.Router();

// สร้างธุรกรรมใหม่
router.post('/create', authenticateToken, TransactionController.create);



export default router;
