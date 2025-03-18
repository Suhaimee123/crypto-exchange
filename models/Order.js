// models/OrderModel.js

class OrderModel {
  constructor(order) {
    this.order_id = order.order_id;
    this.user_id = order.user_id;
    this.order_type = order.order_type;
    this.currency_type = order.currency_type;
    this.fiat_currency = order.fiat_currency;
    this.amount = order.amount;
    this.price = order.price;
    this.status = order.status;
    this.created_at = order.created_at;
  }

  // เมธอดในการแสดงข้อมูลของคำสั่งซื้อ
  getOrderInfo() {
    return {
      order_id: this.order_id,
      user_id: this.user_id,
      order_type: this.order_type,
      currency_type: this.currency_type,
      fiat_currency: this.fiat_currency,
      amount: this.amount,
      price: this.price,
      status: this.status,
      created_at: this.created_at,
    };
  }
}

export default OrderModel;
