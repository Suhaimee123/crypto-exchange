// routes/walletRoutes.js
import express from 'express';
import WalletController from '../controllers/WalletController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/create', authenticateToken, WalletController.create);

router.get('/user',authenticateToken, WalletController.getByUser);


  

export default router;
