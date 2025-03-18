import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    ssl: { rejectUnauthorized: false  } // Enforce SSL connection
});

const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database Connection Successful!!');
        connection.release();
    } catch (error) {
        console.log('Error connecting to database!');
        throw error;
    }
};

export { pool, checkConnection };
