// models/WalletModel.js

class WalletModel {
  constructor(wallet) {
    this.wallet_id = wallet.wallet_id;
    this.user_id = wallet.user_id;

  }

  // เมธอดในการแสดงข้อมูลของกระเป๋า
  getWalletInfo() {
    return {
      wallet_id: this.wallet_id,
      user_id: this.user_id,

    };
  }
}

export default WalletModel;
