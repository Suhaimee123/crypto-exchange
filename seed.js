import { registerUser } from './services/UserService.js';
import { createWallet } from './services/WalletService.js';

import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// ฟังก์ชัน Login และคืนค่า JWT Token
const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;  // ที่นี้มันจะต้องส่งคืนข้อมูลที่มี token และ user_id
};


const createWalletCurrency = async (token, walletId, currencyType, balance) => {
  const response = await axios.post(`${API_URL}/walletCurrency/create`, {
    wallet_id: walletId,
    currency_type: currencyType,
    balance: balance,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// ฟังก์ชันสำหรับสร้าง Order พร้อม Token
const createOrderWithToken = async (token, orderData) => {
  const response = await axios.post(`${API_URL}/orders/create`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ฟังก์ชันสำหรับสร้าง Transaction พร้อม Token
const createTransactionWithToken = async (token, transactionData) => {
  console.log("Transaction data being sent:", transactionData); // ล็อกข้อมูลที่ส่งไปก่อน
  try {
    const response = await axios.post(`${API_URL}/transaction/create`, transactionData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error.response ? error.response.data : error.message);
    throw new Error("Failed to create transaction");
  }
};


// Seed Database
const seedDatabase = async () => {
  try {
    // Register users
    let user1, user2;

    try {
      user1 = await registerUser({ email: "testuser@example.com", password: "securepassword123" });
      console.log("User1 created:", user1);
    } catch (registerError1) {
      console.error("Error registering user1:", registerError1.message);
    }

    try {
      user2 = await registerUser({ email: "testuser2@example.com", password: "securepassword123" });
      console.log("User2 created:", user2);
    } catch (registerError2) {
      console.error("Error registering user2:", registerError2.message);
    }

    // Login to get tokens
    const loginUser1 = await loginUser("testuser@example.com", "securepassword123");
    const loginUser2 = await loginUser("testuser2@example.com", "securepassword123");
    
    console.log("loginUser", loginUser1, loginUser2);
    console.log("Tokens retrieved:", loginUser1.token, loginUser2.token);

    const token1 =loginUser1.token
    const token2 =loginUser2.token
    
    // Create wallets
    const wallet1 = await createWallet({ user_id: loginUser1.user.user_id });
    const wallet2 = await createWallet({ user_id: loginUser2.user.user_id });
    
    console.log("Wallets created:", wallet1, wallet2);

    console.log("Wallets created:", wallet1, wallet2);

    const walletCurrency1 = await createWalletCurrency(token1, wallet1.wallet_id, "BTC", 5);
    const walletCurrency2 = await createWalletCurrency(token2, wallet2.wallet_id, "USD", 5000);

    console.log("Wallet Currency created:", walletCurrency1, walletCurrency2);

    // Create order using token1
    const order = await createOrderWithToken(token1, {
      wallet_id: wallet1.wallet_id,
      order_type: "sell",
      currency_type: "BTC",
      fiat_currency: "USD",
      amount: 1,
      price: 300,
      status: "pending",
    });

    console.log("Order object:", order);  // พิมพ์ดูว่า 'order' มีโครงสร้างยังไง
    console.log("order.order_id:", order.order.order_id);  // ตรวจสอบว่า order_id มีค่า


    // Create transaction using token2
    const transaction = await createTransactionWithToken(token2, {
      order_id: order.order.order_id,
      to_wallet_id: wallet2.wallet_id, // User2 รับ BTC
      transaction_type: "transfer",
    });

    console.log("Transaction created:", transaction);

  } catch (error) {
    console.error("Error seeding database:", error.response ? error.response.data : error.message);
  }
};

seedDatabase();
