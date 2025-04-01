# Cryptocurrency Exchange System

## ขั้นตอนการติดตั้ง

1. คลอนโปรเจคไปที่เครื่องของคุณ:

   ```bash
   git clone https://github.com/Suhaimee123/crypto-exchange.git


2. เข้าไปที่ไดเรกทอรีโปรเจค:

    cd crypto-exchange

3. ติดตั้ง dependencies:

    npm install

4. **ตั้งค่าไฟล์ .env ด้วยข้อมูลที่ให้มา**  
   สร้างไฟล์ `.env` ในโปรเจคของคุณและใส่ข้อมูลต่อไปนี้:

   ```bash
   DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
   DB_USER=2VE6rDKpKkiNNta.root
   DB_PASS=5gRJazNGrwdBUWoS
   DB_NAME=test
   JWT_SECRET_KEY=your_secret_key_here

## วิธีการรันใช้งาน

    รันโปรเจค: ใช้คำสั่งใดคำสั่งหนึ่งต่อไปนี้ในการรันโปรเจค:

        node app.js หรือ nodemon app 

## ขั้นตอนการใช้งาน
    ขั้นตอนที่ 1: สมัครสมาชิก

        ไปที่ http://localhost:3000/api/register (Method: POST)

        ส่งข้อมูลในรูปแบบ JSON:

            {
                "email": "testuser@example.com",
                "password": "securepassword123"
            }

    ขั้นตอนที่ 2 login 

        ไปที่ http://localhost:3000/api/login (Method: POST)

        ส่งข้อมูลในรูปแบบ JSON:

            {
                "email": "testuser@example.com",
                "password": "securepassword123"
            }

        การตอบกลับจาก API:


            {   
                "message": "Login successful",
                "user": {
                    "user_id": "441cd0bd-afbf-4689-9f2f-b7fe82d0e1bf",
                    "email": "testuser@example.com",
                    "created_at": "2025-03-18T16:01:03.000Z",
                    "updated_at": "2025-03-18T16:01:03.000Z"
                },
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDQxY2QwYmQtYWZiZi00Njg5LTlmMmYtYjdmZTgyZDBlMWJmIiwiZW1haWwiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc0MjMxMzg0OCwiZXhwIjoxNzQyNDAwMjQ4fQ.JEKAgHCtxi3dAP7OP1btE_rkDPl6MEV7L8xkLpn_HJ8"
            }

    ขั้นตอนที่ 3: สร้างกระเป๋าเงิน (Wallet)

        ไปที่ http://localhost:3000/api/wallets/create (Method: POST)

        ใช้ Token ที่ได้จากการเข้าสู่ระบบในหัวข้อ Authorization (Bearer Token)

        ส่งข้อมูลในรูปแบบ JSON:

            {
                "message": "Wallet created successfully",
                "wallet": {
                        "wallet_id": "130d4a69-39b8-43ae-95c9-8836d92414e5",
                        "user_id": "adffca1a-2055-4efc-a8a8-66b2f00cee44"
                }
            }

    ขั้นตอนที่ 4: เติมเงินเข้ากระเป๋าเงิน

        ไปที่ http://localhost:3000/api/walletCurrency/create (Method: POST)

        ใช้ Token ที่ได้จากการเข้าสู่ระบบในหัวข้อ Authorization (Bearer Token)

        ส่งข้อมูลในรูปแบบ JSON:

            {
                "wallet_id": "130d4a69-39b8-43ae-95c9-8836d92414e5",
                "currency_type": "USD",
                "balance": 10000.00
            }


    ขั้นตอนที่ 5: สร้างคำสั่ง (Order)

        ไปที่ http://localhost:3000/api/orders/create (Method: POST)

        ใช้ Token ที่ได้จากการเข้าสู่ระบบในหัวข้อ Authorization (Bearer Token)

        ส่งข้อมูลในรูปแบบ JSON:

            {
                "wallet_id": "130d4a69-39b8-43ae-95c9-8836d92414e5",
                "order_type": "sell",
                "currency_type": "BTC",
                "fiat_currency": "USD",
                "amount": 1,
                "price": 3000,
                "status": "pending"
            }

        การตอบกลับจาก API:


            {
                "message": "Order created successfully",
                 "order": {
                        "order_id": "c3b3d3a0-820e-4b63-bc03-a39dff8ef399",
                        "user_id": "441cd0bd-afbf-4689-9f2f-b7fe82d0e1bf",
                        "order_type": "sell",
                        "currency_type": "BTC",
                        "fiat_currency": "USD",
                        "amount": 1,
                        "price": 3000000,
                        "status": "pending",
                        "created_at": "2025-03-18T16:04:51.781Z"
                    }   
            }


    ขั้นตอนที่ 6: การทำธุรกรรม (Transaction)

        ไปที่ http://localhost:3000/api/transaction/create (Method: POST)

        ใช้ Token ที่ได้จากการเข้าสู่ระบบในหัวข้อ Authorization (Bearer Token)

        ส่งข้อมูลในรูปแบบ JSON:


        {
            "order_id": "c3b3d3a0-820e-4b63-bc03-a39dff8ef399",
            "to_wallet_id": "",
            "transaction_type": "transfer"
        }

        การตอบกลับจาก API:

        {
            "message": "Transaction created successfully",
            "transaction": {
                "success": true,
                "message": "ธุรกรรมสำเร็จ",
                "data": {
                    "transaction_id": "813becd4-7c1b-499e-8527-72b10a0418f1",
                    "order_id": "c3b3d3a0-820e-4b63-bc03-a39dff8ef399",
                    "from_wallet_id": "130d4a69-39b8-43ae-95c9-8836d92414e5",
                    "to_wallet_id": "",
                    "currency_type": "BTC",
                    "amount": 1,
                    "transaction_type": "transfer",
                    "created_at": "2025-03-18T15:22:15.780Z"
                }
            }
        }

## ขั้นตอนทดสอบอัตโนมัติ (Seed Database)

    หากคุณต้องการทดสอบการทำงานทั้งหมดโดยอัตโนมัติ สามารถใช้คำสั่งนี้:

        node seed.js





**รายละเอียดการแก้ไข:**
- เพิ่มขั้นตอนการติดตั้ง dependencies และการตั้งค่าไฟล์ `.env`
- แนะนำการรันโปรเจคและการทดสอบ
- เพิ่มการทดสอบอัตโนมัติโดยใช้ `seed.js`



