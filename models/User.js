// models/UserModel.js

class UserModel {
  constructor(user) {
    this.user_id = user.user_id;
    this.email = user.email;
    this.password_hash = user.password_hash;  // เปิดใช้งานการเก็บ password_hash
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }

  // เมธอดในการแสดงข้อมูลผู้ใช้
  getUserInfo() {
    return {
      user_id: this.user_id,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // เมธอดในการดึง password_hash
  getPasswordHash() {
    return this.password_hash;
  }
}

export default UserModel;
