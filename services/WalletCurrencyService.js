// services/WalletCurrencyService.js
import { pool } from '../config/database.js';
import WalletCurrency from '../models/WalletCurrency.js';
import { generateUUID } from '../utils/generateUUID.js'; // ฟังก์ชันสำหรับสร้าง UUID

// ฟังก์ชันสำหรับสร้างหรืออัปเดต WalletCurrency
const createOrUpdateWalletCurrency = async (wallet_id, currency_type, balance) => {
    try {
      if (!wallet_id || !currency_type || balance == null) {
        throw new Error('Missing required fields');
      }
  
      const created_at = new Date();
      const updated_at = new Date();
  
      // เช็คว่ามี WalletCurrency ที่ wallet_id และ currency_type นี้อยู่ในฐานข้อมูลแล้วหรือไม่
      const [existingWalletCurrency] = await pool.query(
        `SELECT * FROM WalletCurrencies WHERE wallet_id = ? AND currency_type = ?`,
        [wallet_id, currency_type]
      );
  
      if (existingWalletCurrency.length > 0) {
        // ถ้ามีข้อมูลอยู่แล้ว ให้ทำการอัปเดต balance และ updated_at
        const wallet_currency_id = existingWalletCurrency[0].wallet_currency_id;
        const old_balance = existingWalletCurrency[0].balance;  // เก็บ balance เก่าไว้
  
        // คำนวณการอัปเดต balance ถ้ามีการเปลี่ยนแปลง
        const new_balance = parseFloat(old_balance) + parseFloat(balance);  // คำนวณยอดใหม่โดยใช้ parseFloat เพื่อความแม่นยำ
  
        // ปัดเศษให้เป็นทศนิยม 2 ตำแหน่ง
        const rounded_balance = new_balance.toFixed(2);
  
        // อัปเดต balance และ updated_at
        const [result] = await pool.query(
          `UPDATE WalletCurrencies SET balance = ?, updated_at = ? WHERE wallet_currency_id = ?`,
          [rounded_balance, updated_at, wallet_currency_id]
        );
  
        // ถ้าไม่สามารถอัปเดตได้
        if (result.affectedRows === 0) {
          throw new Error('Failed to update WalletCurrency');
        }
  
        // คืนค่า WalletCurrency ที่อัปเดต
        return new WalletCurrency(
          wallet_currency_id,
          wallet_id,
          currency_type,
          rounded_balance,
          existingWalletCurrency[0].created_at,
          updated_at
        );
      } else {
        // ถ้าไม่มีข้อมูลในฐานข้อมูล ให้สร้างข้อมูลใหม่
        const wallet_currency_id = generateUUID();  // สร้าง UUID สำหรับ WalletCurrency
  
        const [result] = await pool.query(
          `INSERT INTO WalletCurrencies (wallet_currency_id, wallet_id, currency_type, balance, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [wallet_currency_id, wallet_id, currency_type, balance, created_at, updated_at]
        );
  
        // ถ้าไม่สามารถเพิ่มข้อมูลได้
        if (result.affectedRows === 0) {
          throw new Error('Failed to insert WalletCurrency');
        }
  
        // สร้าง instance ของ WalletCurrency
        return new WalletCurrency(wallet_currency_id, wallet_id, currency_type, balance, created_at, updated_at);
      }
    } catch (error) {
      console.error('Error creating or updating WalletCurrency:', error);
      throw new Error('Error creating or updating WalletCurrency');
    }
  };
  
  

// ฟังก์ชันสำหรับดึง WalletCurrencies ตาม wallet_id
const getWalletCurrenciesByWalletId = async (wallet_id) => {
  try {
    const [walletCurrencies] = await pool.query(
      'SELECT * FROM WalletCurrencies WHERE wallet_id = ?',
      [wallet_id]
    );
    return walletCurrencies;
  } catch (error) {
    console.error('Error fetching WalletCurrencies:', error);
    throw new Error('Error fetching WalletCurrencies');
  }
};

// ฟังก์ชันสำหรับอัปเดตยอดเงินใน WalletCurrency
const updateWalletCurrencyBalance = async (wallet_currency_id, balance) => {
  try {
    if (balance == null) {
      throw new Error('Balance is required');
    }

    const updated_at = new Date();

    // SQL สำหรับอัปเดตยอดเงิน
    const [result] = await pool.query(
      'UPDATE WalletCurrencies SET balance = ?, updated_at = ? WHERE wallet_currency_id = ?',
      [balance, updated_at, wallet_currency_id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Failed to update WalletCurrency balance');
    }

    return { wallet_currency_id, balance, updated_at };
  } catch (error) {
    console.error('Error updating WalletCurrency balance:', error);
    throw new Error('Error updating WalletCurrency balance');
  }
};

export { createOrUpdateWalletCurrency, getWalletCurrenciesByWalletId, updateWalletCurrencyBalance };
