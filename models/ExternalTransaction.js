// models/ExternalTransactionModel.js

class ExternalTransactionModel {
  constructor(externalTransaction) {
    this.ext_transaction_id = externalTransaction.ext_transaction_id;
    this.user_id = externalTransaction.user_id;
    this.wallet_id = externalTransaction.wallet_id;
    this.currency_type = externalTransaction.currency_type;
    this.amount = externalTransaction.amount;
    this.external_address = externalTransaction.external_address;
    this.status = externalTransaction.status;
    this.created_at = externalTransaction.created_at;
  }

  // เมธอดในการแสดงข้อมูลของธุรกรรมภายนอก
  getExternalTransactionInfo() {
    return {
      ext_transaction_id: this.ext_transaction_id,
      user_id: this.user_id,
      wallet_id: this.wallet_id,
      currency_type: this.currency_type,
      amount: this.amount,
      external_address: this.external_address,
      status: this.status,
      created_at: this.created_at,
    };
  }
}

export default ExternalTransactionModel;
