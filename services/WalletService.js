// services/WalletService.js
import { pool } from '../config/database.js';
import WalletModel from '../models/Wallet.js';
import { generateUUID } from '../utils/generateUUID.js';

const createWallet = async ({ user_id }) => {
  try {
    if (!user_id) {
      throw new Error('Missing required fields');
    }

    const wallet_id = generateUUID();  // สมมติการสร้าง UUID
    const created_at = new Date();

    const [result] = await pool.query(
      'INSERT INTO Wallets (wallet_id, user_id, created_at) VALUES (?, ?, ?)',
      [wallet_id, user_id, created_at]
    );

    if (result.affectedRows === 0) {
      throw new Error('Failed to insert wallet');
    }

    const newWallet = new WalletModel({ wallet_id, user_id, created_at });
    return newWallet;
  } catch (error) {
    // console.error('Error creating wallet:', error); 
    throw new Error('Error creating wallet');
  }
};


const   getWalletsByUser = async (user_id) => {
  try {
    const [wallets] = await pool.query('SELECT * FROM Wallets WHERE user_id = ?', [user_id]);
    return wallets;
  } catch (error) {
    throw new Error('Error fetching wallets');
  }
};



export { createWallet, getWalletsByUser };
