// controllers/WalletCurrencyController.js
import { createOrUpdateWalletCurrency, getWalletCurrenciesByWalletId, updateWalletCurrencyBalance } from '../services/WalletCurrencyService.js';

const create = async (req, res) => {
  const { wallet_id, currency_type, balance } = req.body;

  try {
    // ใช้ฟังก์ชันที่เราสร้างเพื่อสร้างหรืออัปเดตข้อมูล
    const walletCurrency = await createOrUpdateWalletCurrency(wallet_id, currency_type, balance);
    return res.status(201).json({
      message: 'WalletCurrency created or updated successfully',
      walletCurrency,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating or updating WalletCurrency' });
  }
};


const getByWalletId = async (req, res) => {
  const { wallet_id } = req.params;  // ดึง wallet_id จาก URL parameter

  try {
    const walletCurrencies = await getWalletCurrenciesByWalletId(wallet_id);
    if (walletCurrencies.length === 0) {
      return res.status(404).json({ message: 'No WalletCurrencies found for this wallet.' });
    }
    return res.status(200).json(walletCurrencies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching WalletCurrencies.' });
  }
};

const updateBalance = async (req, res) => {
  const { wallet_currency_id } = req.params;  // ดึง wallet_currency_id จาก URL parameter
  const { balance } = req.body;  // รับข้อมูล balance จาก request body

  if (balance == null) {
    return res.status(400).json({ message: 'Balance is required.' });
  }

  try {
    const updatedWalletCurrency = await updateWalletCurrencyBalance(wallet_currency_id, balance);
    return res.status(200).json({ message: 'WalletCurrency balance updated successfully', updatedWalletCurrency });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating WalletCurrency balance.' });
  }
};

export default {
  create,
  getByWalletId,
  updateBalance,
};
