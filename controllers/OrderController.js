// controllers/OrderController.js
import { createOrder, getOrdersByUser } from '../services/OrderService.js';

const create = async (req, res) => {
  const { wallet_id,order_type, currency_type, fiat_currency, amount, price, status } = req.body;
  const user_id = req.user.user_id; // ดึง user_id จาก token ที่ถูกตรวจสอบแล้ว

  if (!user_id || !wallet_id || !order_type || !currency_type || !fiat_currency || amount == null || price == null || !status) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newOrder = await createOrder({ user_id,wallet_id, order_type, currency_type, fiat_currency, amount, price, status });
    return res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating order.' });
  }
};

const getByUser = async (req, res) => {
  const user_id = req.user.user_id; // ใช้ user_id จาก token

  try {
    const orders = await getOrdersByUser(user_id);
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching orders.' });
  }
};

export default {
  create,
  getByUser,
};
