// models/WalletCurrency.js


class WalletCurrency {
    constructor(wallet_currency_id, wallet_id, currency_type, balance, created_at, updated_at) {
      this.wallet_currency_id = wallet_currency_id;
      this.wallet_id = wallet_id;
      this.currency_type = currency_type;
      this.balance = balance;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  

  }
  
  export default WalletCurrency;
  