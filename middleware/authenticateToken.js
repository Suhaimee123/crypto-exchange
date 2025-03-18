// middleware/authenticateToken.js
import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired.' }); 
      } else {
        return res.status(401).json({ message: 'Invalid token.' });
      }
    }

    req.user = user; // ส่งข้อมูลผู้ใช้ไปยัง route handler
    console.log("user",user)
    next();
  });
};

export default authenticateToken;
