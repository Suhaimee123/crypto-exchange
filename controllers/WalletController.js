// controllers/WalletController.js
import { createWallet, getWalletsByUser } from '../services/WalletService.js';

const create = async (req, res) => {
  const { user_id } = req.user;  // ดึง user_id จาก JWT token

  try {
    const newWallet = await createWallet({ user_id });
    return res.status(201).json({ message: 'Wallet created successfully', wallet: newWallet });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating wallet.' });
  }
};

const getByUser = async (req, res) => {
  const { user_id } = req.user;

  try {
    const wallets = await getWalletsByUser(user_id);
    return res.status(200).json(wallets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching wallets.' });
  }
};

export default {
  create,
  getByUser,
};
