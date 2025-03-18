import { createTransaction } from "../services/TransactionService.js";

const create = async (req, res) => {
    const { order_id, transaction_type,to_wallet_id } = req.body;
    const { user_id } = req.user;


    if (!transaction_type) {
        return res.status(400).json({ message: 'transaction_type is required.' });
    }


    try {
        const newTransaction = await createTransaction({ order_id, user_id, transaction_type,to_wallet_id });
        return res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating transaction.' });
    }
};

export default { create };
