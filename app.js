
//app

import express from 'express';
import { checkConnection } from './config/database.js';
import createAllTable from './Migrations/Migrations.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import walletCurrency from './routes/walletCurrencyRoutes.js'

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, async () => {
  console.log('Server running on port 3000');
  try {
    await checkConnection(); // ตรวจสอบการเชื่อมต่อกับฐานข้อมูล
    await createAllTable();  // สร้างตารางถ้ายังไม่มี
  } catch (error) {
    console.log("Failed to initialize the database", error);
  }
});

app.use('/api/', userRoutes); // Use user routes for API calls
app.use('/api/wallets', walletRoutes);
app.use('/api/walletCurrency', walletCurrency);
app.use('/api/orders', orderRoutes);
app.use('/api/transaction', transactionRoutes);
