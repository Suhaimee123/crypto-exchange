// services/UserService.js
import { pool } from '../config/database.js'; 
import UserModel from '../models/User.js';
import argon2 from 'argon2';
import { EmailAlreadyExistsError } from '../utils/CustomErrors.js'; // นำเข้าข้อผิดพลาด
import { generateUUID } from '../utils/generateUUID.js';

const registerUser = async ({ email, password }) => {
  try {
    const [existingUser] = await pool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (existingUser?.user_id) {
      // โยนข้อผิดพลาดชนิด EmailAlreadyExistsError
      throw new EmailAlreadyExistsError();
    }


    const hashedPassword = await argon2.hash(password);

    const user_id = generateUUID(); 
    const created_at = new Date();
    const updated_at = new Date();

    const [result] = await pool.query(
      'INSERT INTO Users (user_id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [user_id, email, hashedPassword, created_at, updated_at]
    );

    const newUser = new UserModel({
      user_id,
      email,
      // password_hash: hashedPassword,
      created_at,
      updated_at,
    });

    return newUser;
  } catch (error) {
    throw error; // โยนข้อผิดพลาดที่เกิดขึ้น
  }
};

const loginUser = async (email) => {
  try {
    const [users] = await pool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    // console.log("users", users); // เพิ่มการแสดงข้อมูลที่ได้จากฐานข้อมูล

    if (!users || users.length === 0) {
      return null; // ถ้าไม่พบผู้ใช้ในฐานข้อมูล
    }

    const user = users[0]; // ดึงข้อมูลผู้ใช้จากอาร์เรย์
    const existingUser = new UserModel(user);

    return existingUser; // คืนค่าผู้ใช้ที่ถูกสร้างจาก UserModel
  } catch (error) {
    throw error; // โยนข้อผิดพลาดที่เกิดขึ้น
  }
};


export { registerUser,loginUser };
