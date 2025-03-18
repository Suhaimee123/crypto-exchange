import { pool } from "../config/database.js";

const tables = {
  Migrations: `
        CREATE TABLE IF NOT EXISTS Migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            table_name VARCHAR(255) NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
    `,
    Users: `
        CREATE TABLE IF NOT EXISTS Users (
            user_id CHAR(36) NOT NULL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
    `,
    Wallets: `
        CREATE TABLE IF NOT EXISTS Wallets (
            wallet_id CHAR(36) NOT NULL PRIMARY KEY,
            user_id CHAR(36),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


    `,
    WalletCurrencies: `
        CREATE TABLE IF NOT EXISTS WalletCurrencies (
            wallet_currency_id CHAR(36) NOT NULL PRIMARY KEY,
            wallet_id CHAR(36),
            currency_type VARCHAR(10),
            balance DECIMAL(15,2),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (wallet_id) REFERENCES Wallets(wallet_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
    `,
    Orders: `
        CREATE TABLE IF NOT EXISTS Orders (
        order_id CHAR(36) NOT NULL PRIMARY KEY,
        user_id CHAR(36),
        wallet_id CHAR(36),  -- เพิ่ม Wallet ID
        order_type VARCHAR(10),
        currency_type VARCHAR(10),
        fiat_currency VARCHAR(10),
        amount DECIMAL(15,2),
        price DECIMAL(15,2),
        status VARCHAR(20),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (wallet_id) REFERENCES Wallets(wallet_id) 
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
    `,
    Transactions: `
        CREATE TABLE IF NOT EXISTS Transactions (
            transaction_id CHAR(36) NOT NULL PRIMARY KEY,
            order_id CHAR(36), 
            from_wallet_id CHAR(36),
            to_wallet_id CHAR(36),
            currency_type VARCHAR(10) NOT NULL,
            amount DECIMAL(18,8) NOT NULL,
            transaction_type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE SET NULL,
            FOREIGN KEY (from_wallet_id) REFERENCES Wallets(wallet_id) ON DELETE SET NULL,
            FOREIGN KEY (to_wallet_id) REFERENCES Wallets(wallet_id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

    `,
    ExternalTransactions: `
        CREATE TABLE IF NOT EXISTS ExternalTransactions (
            ext_transaction_id CHAR(36) NOT NULL PRIMARY KEY,
            order_id CHAR(36),
            user_id CHAR(36),
            wallet_id CHAR(36),
            currency_type VARCHAR(10),
            amount DECIMAL(15,2),
            external_address VARCHAR(255),
            status VARCHAR(20),  -- Pending, Completed, Failed
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE SET NULL,
            FOREIGN KEY (user_id) REFERENCES Users(user_id),
            FOREIGN KEY (wallet_id) REFERENCES Wallets(wallet_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
    `
};

const tableExists = async (tableName) => {
  try {
      const [rows] = await pool.query(
          "SELECT COUNT(*) AS count FROM Migrations WHERE table_name = ?;",
          [tableName]
      );
      return rows[0].count > 0;
  } catch (error) {
      console.error(`Error checking table ${tableName}:`, error);
      return false;
  }
};

const createTable = async (tableName, query) => {
  try {
      const exists = await tableExists(tableName);
      if (!exists) {
          await pool.query(query);
          await pool.query("INSERT INTO Migrations (table_name) VALUES (?);", [tableName]);
          console.log(`Table created: ${tableName}`);
      }
  } catch (error) {
      console.error(`Error creating ${tableName}:`, error);
  }
};

// สร้างทุกตารางที่จำเป็น
const createAllTable = async () => {
  try {
      // สร้าง `Migrations` เป็นตัวแรก
      await createTable("Migrations", tables.Migrations);

      for (const [tableName, query] of Object.entries(tables)) {
          if (tableName !== "Migrations") {
              await createTable(tableName, query);
          }
      }
  } catch (error) {
      console.error("Error creating tables", error);
      throw error;
  }
};

export default createAllTable;