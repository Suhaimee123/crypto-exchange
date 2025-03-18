// models/TransactionModel.js

class TransactionModel {
  constructor(transaction) {
    this.transaction_id = transaction.transaction_id;
    this.from_wallet_id = transaction.from_wallet_id;
    this.to_wallet_id = transaction.to_wallet_id;
    this.currency_type = transaction.currency_type;
    this.amount = transaction.amount;
    this.transaction_type = transaction.transaction_type;
    this.created_at = transaction.created_at;
  }

  // เมธอดในการแสดงข้อมูลของการทำธุรกรรม
  getTransactionInfo() {
    return {
      transaction_id: this.transaction_id,
      from_wallet_id: this.from_wallet_id,
      to_wallet_id: this.to_wallet_id,
      currency_type: this.currency_type,
      amount: this.amount,
      transaction_type: this.transaction_type,
      created_at: this.created_at,
    };
  }
}

export default TransactionModel;
