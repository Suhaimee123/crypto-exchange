// routes/walletCurrencyRoutes.js
import express from 'express';
import WalletCurrencyController from '../controllers/WalletCurrencyController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Route สำหรับสร้าง WalletCurrency ใหม่
router.post('/create', authenticateToken, WalletCurrencyController.create);

// Route สำหรับดึง WalletCurrencies ของ user โดยใช้ wallet_id
router.get('/wallet/:wallet_id', authenticateToken, WalletCurrencyController.getByWalletId);

// Route สำหรับอัปเดตยอดเงินใน WalletCurrency
router.put('/update/:wallet_currency_id', authenticateToken, WalletCurrencyController.updateBalance);

export default router;
