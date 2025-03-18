// services/OrderService.js
import { pool } from '../config/database.js';
import OrderModel from '../models/Order.js';
import { generateUUID } from '../utils/generateUUID.js';

const createOrder = async ({ user_id, wallet_id, order_type, currency_type, fiat_currency, amount, price, status }) => {
  try {
    const order_id = generateUUID(); 
    const created_at = new Date();

    const [result] = await pool.query(
      'INSERT INTO Orders (order_id, user_id, wallet_id, order_type, currency_type, fiat_currency, amount, price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [order_id, user_id, wallet_id, order_type, currency_type, fiat_currency, amount, price, status, created_at]
    );

    const newOrder = new OrderModel({ order_id, user_id, wallet_id, order_type, currency_type, fiat_currency, amount, price, status, created_at });
    return newOrder;
  } catch (error) {
    throw new Error('Error creating order');
  }
};


const getOrdersByUser = async (user_id) => {
  try {
    const [orders] = await pool.query('SELECT * FROM Orders WHERE user_id = ?', [user_id]);
    return orders;
  } catch (error) {
    throw new Error('Error fetching orders');
  }
};



export { createOrder, getOrdersByUser };
