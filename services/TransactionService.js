import { pool } from '../config/database.js';
import { generateUUID } from '../utils/generateUUID.js';

const createTransaction = async ({ order_id, user_id, transaction_type, to_wallet_id }) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const transaction_id = generateUUID();
        const created_at = new Date();

        // ดึงข้อมูล order ที่เกี่ยวข้อง
        const [orders] = await connection.query(
            `SELECT * FROM Orders WHERE order_id = ?`,
            [order_id]
        );

        if (orders.length === 0) {
            return { success: false, message: 'ไม่พบคำสั่งซื้อ' };
        }

        const order = orders[0]; 

        if (order.status === 'Completed') {
            return { success: false, message: 'คำสั่งซื้อนี้เสร็จสิ้นแล้ว' };
        }

        let currency_type = order.currency_type;
        let amount = parseFloat(order.amount);
        const from_wallet_id = order.wallet_id;
        const fiat_currency = order.fiat_currency;
        const price = order.price;
        
        const [fromWallet] = await connection.query(
            `SELECT balance FROM WalletCurrencies WHERE wallet_id = ? AND currency_type = ?`,
            [from_wallet_id, currency_type]
        );

        if (fromWallet.length === 0) {
            return { success: false, message: 'ไม่พบข้อมูลกระเป๋าเงินต้นทาง' };
        }
        const from_balance = parseFloat(fromWallet[0].balance);
        if (from_balance < amount) {
            return { success: false, message: 'ยอดเงินในกระเป๋าเงินต้นทางไม่เพียงพอ' };
        }

        // ลดยอดเงินในกระเป๋าเงินต้นทาง
        await connection.query(
            `UPDATE WalletCurrencies SET balance = balance - ? WHERE wallet_id = ? AND currency_type = ?`,
            [amount, from_wallet_id, currency_type]
        );

        // เพิ่มยอดเงินในกระเป๋าเงินปลายทาง
        const [existingWalletCurrency] = await connection.query(
            `SELECT wallet_currency_id FROM WalletCurrencies 
             WHERE wallet_id = ? AND currency_type = ?`,
            [to_wallet_id, currency_type]
        );
        
        if (existingWalletCurrency.length > 0) {
            // ถ้ามีอยู่แล้ว ให้อัปเดต balance
            await connection.query(
                `UPDATE WalletCurrencies SET balance = balance + ? 
                 WHERE wallet_id = ? AND currency_type = ?`,
                [amount, to_wallet_id, currency_type]
            );
        } else {
            // ถ้ายังไม่มี ให้สร้างใหม่
            const walletCurrencyId = generateUUID();
            await connection.query(
                `INSERT INTO WalletCurrencies (wallet_currency_id, wallet_id, currency_type, balance)
                 VALUES (?, ?, ?, ?)`,
                [walletCurrencyId, to_wallet_id, currency_type, amount]
            );
        }

                // ค้นหากระเป๋าเงินของผู้ซื้อที่มี USD
        const [buyerWallet] = await connection.query(
            `SELECT balance FROM WalletCurrencies WHERE wallet_id = ? AND currency_type = ?`,
            [to_wallet_id, fiat_currency] // USD
        );

        if (buyerWallet.length === 0) {
            return { success: false, message: 'ผู้ซื้อไม่มีเงิน Fiat ในกระเป๋า' };
        }

        const buyer_balance = parseFloat(buyerWallet[0].balance);

        // ตรวจสอบว่ายอดเงินพอหรือไม่
        if (buyer_balance < price) {
            return { success: false, message: 'ยอดเงินของผู้ซื้อไม่เพียงพอ' };
        }

        // หักเงิน USD ออกจากกระเป๋าผู้ซื้อ
        await connection.query(
            `UPDATE WalletCurrencies SET balance = balance - ? WHERE wallet_id = ? AND currency_type = ?`,
            [price, to_wallet_id, fiat_currency]
        );

        // เพิ่มเงิน USD เข้าไปในกระเป๋าของผู้ขาย
        const [sellerWallet] = await connection.query(
            `SELECT wallet_currency_id FROM WalletCurrencies WHERE wallet_id = ? AND currency_type = ?`,
            [from_wallet_id, fiat_currency] // USD
        );

        if (sellerWallet.length > 0) {
            await connection.query(
                `UPDATE WalletCurrencies SET balance = balance + ? WHERE wallet_id = ? AND currency_type = ?`,
                [price, from_wallet_id, fiat_currency]
            );
        } else {
            const walletCurrencyId = generateUUID();
            await connection.query(
                `INSERT INTO WalletCurrencies (wallet_currency_id, wallet_id, currency_type, balance)
                VALUES (?, ?, ?, ?)`,
                [walletCurrencyId, from_wallet_id, fiat_currency, price]
            );
        }

        
        

        // สร้างธุรกรรม
        await connection.query(
            `INSERT INTO Transactions (transaction_id, order_id, from_wallet_id, to_wallet_id, currency_type, amount, transaction_type, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [transaction_id, order_id, from_wallet_id, to_wallet_id, currency_type, amount, transaction_type, created_at]
        );

        await connection.query(
            `UPDATE Orders SET status = 'Completed' WHERE order_id = ?`,
            [order_id]
        );

        await connection.commit();

            return {
                success: true,
                message: 'ธุรกรรมสำเร็จ',
                data: {
                    transaction_id,
                    order_id,
                    from_wallet_id,
                    to_wallet_id,
                    currency_type,
                    amount,
                    transaction_type,
                    created_at,
                },
            };
        } catch (error) {
        await connection.rollback();
        console.error("เกิดข้อผิดพลาดในธุรกรรม:", error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการสร้างธุรกรรม', error: error.message };
    } finally {
        connection.release();
    }
};

export { createTransaction };
