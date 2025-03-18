// controllers/UserController.js
import { registerUser } from '../services/UserService.js';
import { EmailAlreadyExistsError } from '../utils/CustomErrors.js'; // นำเข้าข้อผิดพลาด
import argon2 from 'argon2';
import { loginUser } from '../services/UserService.js';  // เพิ่มการนำเข้าฟังก์ชัน loginUser
import jwt from 'jsonwebtoken';



const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const newUser = await registerUser({ email, password });
    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Error registering user.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await loginUser(email);

    if (!user || !user.getPasswordHash()) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await argon2.verify(user.getPasswordHash(), password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // สร้าง JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET_KEY, 
      { expiresIn: '1d' }  
    );

    return res.status(200).json({
      message: 'Login successful',
      user: user.getUserInfo(),
      token,  // ส่งกลับ JWT
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in user.' });
  }
};




export default {
  register,
  login,
};