import Database from "better-sqlite3";
import { mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "data");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
const dbPath = process.env.DATABASE_PATH || join(dataDir, "banking.db");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'Active'
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      type TEXT NOT NULL,
      balance REAL NOT NULL,
      status TEXT NOT NULL,
      created TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES accounts(id),
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      number_masked TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      card_limit REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fraud_detections (
      id TEXT PRIMARY KEY,
      txn_id TEXT NOT NULL,
      risk_score INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fraud_alerts (
      id TEXT PRIMARY KEY,
      fraud_id TEXT NOT NULL,
      message TEXT NOT NULL,
      severity TEXT NOT NULL,
      status TEXT NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transaction_trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month_label TEXT NOT NULL,
      credits REAL NOT NULL,
      debits REAL NOT NULL,
      transfers REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fraud_trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month_label TEXT NOT NULL,
      detected INTEGER NOT NULL,
      resolved INTEGER NOT NULL,
      false_positive INTEGER NOT NULL
    );
  `);
}

function isSeeded() {
  const r = db.prepare("SELECT 1 as ok FROM customers LIMIT 1").get();
  return Boolean(r);
}

function seed() {
  if (isSeeded()) return;

  const insertC = db.prepare(
    "INSERT INTO customers (id, name, email, phone, status) VALUES (?, ?, ?, ?, ?)"
  );
  const insertA = db.prepare(
    "INSERT INTO accounts (id, customer_id, type, balance, status, created) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertT = db.prepare(
    "INSERT INTO transactions (id, account_id, type, amount, date, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  const insertCard = db.prepare(
    "INSERT INTO cards (id, customer_id, number_masked, type, status, card_limit) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertFd = db.prepare(
    "INSERT INTO fraud_detections (id, txn_id, risk_score, reason, status, date) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertFa = db.prepare(
    "INSERT INTO fraud_alerts (id, fraud_id, message, severity, status, date) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertTt = db.prepare(
    "INSERT INTO transaction_trends (month_label, credits, debits, transfers) VALUES (?, ?, ?, ?)"
  );
  const insertFt = db.prepare(
    "INSERT INTO fraud_trends (month_label, detected, resolved, false_positive) VALUES (?, ?, ?, ?)"
  );

  const tr = db.transaction(() => {
    for (const row of [
      ["C001", "Aarav Sharma", "aarav@mail.com", "+91 98765 43210", "Active"],
      ["C002", "Priya Patel", "priya@mail.com", "+91 87654 32109", "Active"],
      ["C003", "Rahul Kumar", "rahul@mail.com", "+91 76543 21098", "Inactive"],
      ["C004", "Sneha Gupta", "sneha@mail.com", "+91 65432 10987", "Active"],
      ["C005", "Vikram Singh", "vikram@mail.com", "+91 54321 09876", "Active"],
      ["C006", "Ananya Reddy", "ananya@mail.com", "+91 43210 98765", "Active"],
    ])
      insertC.run(...row);

    for (const row of [
      ["ACC001", "C001", "Savings", 125000.5, "Active", "2024-01-15"],
      ["ACC002", "C001", "Current", 450000, "Active", "2024-02-20"],
      ["ACC003", "C002", "Savings", 87500.25, "Active", "2024-03-10"],
      ["ACC004", "C003", "Savings", 12000, "Frozen", "2024-01-05"],
      ["ACC005", "C004", "Current", 340000.75, "Active", "2024-04-18"],
      ["ACC006", "C005", "Savings", 95000, "Active", "2024-05-22"],
    ])
      insertA.run(...row);

    for (const row of [
      ["TXN001", "ACC001", "Credit", 50000, "2024-12-01", "Salary Deposit", "Completed"],
      ["TXN002", "ACC002", "Debit", 15000, "2024-12-02", "Bill Payment", "Completed"],
      ["TXN003", "ACC003", "Transfer", 25000, "2024-12-03", "Fund Transfer", "Completed"],
      ["TXN004", "ACC001", "Debit", 120000, "2024-12-04", "Large Withdrawal", "Flagged"],
      ["TXN005", "ACC005", "Credit", 75000, "2024-12-05", "Investment Return", "Completed"],
      ["TXN006", "ACC004", "Debit", 8000, "2024-12-06", "ATM Withdrawal", "Completed"],
      ["TXN007", "ACC002", "Transfer", 200000, "2024-12-07", "Wire Transfer", "Flagged"],
      ["TXN008", "ACC006", "Credit", 30000, "2024-12-08", "Refund", "Completed"],
      ["TXN009", "ACC003", "Transfer", 12000, "2024-12-05", "Rapid payment batch", "Flagged"],
      ["TXN010", "ACC001", "Debit", 5000, "2024-12-08", "Overseas POS", "Flagged"],
      ["TXN011", "ACC002", "Debit", 2000, "2024-12-06", "UPI to merchant", "Completed"],
    ])
      insertT.run(...row);

    for (const row of [
      ["CARD001", "C001", "•••• •••• •••• 4521", "Visa Debit", "Active", 200000],
      ["CARD002", "C002", "•••• •••• •••• 8734", "Mastercard Credit", "Active", 500000],
      ["CARD003", "C003", "•••• •••• •••• 1290", "Visa Credit", "Blocked", 300000],
      ["CARD004", "C004", "•••• •••• •••• 5678", "Rupay Debit", "Active", 100000],
    ])
      insertCard.run(...row);

    for (const row of [
      [
        "FRD001",
        "TXN004",
        92,
        "Unusual large withdrawal from savings",
        "Under Review",
        "2024-12-04",
      ],
      [
        "FRD002",
        "TXN007",
        88,
        "High-value wire transfer to new beneficiary",
        "Investigating",
        "2024-12-07",
      ],
      [
        "FRD003",
        "TXN009",
        75,
        "Multiple transactions in short timeframe",
        "Resolved",
        "2024-12-05",
      ],
      [
        "FRD004",
        "TXN010",
        95,
        "Transaction from unusual geographic location",
        "Under Review",
        "2024-12-08",
      ],
      [
        "FRD005",
        "TXN011",
        60,
        "Deviation from spending pattern",
        "Resolved",
        "2024-12-06",
      ],
    ])
      insertFd.run(...row);

    for (const row of [
      [
        "ALT001",
        "FRD001",
        "Suspicious withdrawal of ₹1,20,000 detected",
        "High",
        "Open",
        "2024-12-04",
      ],
      [
        "ALT002",
        "FRD002",
        "Wire transfer of ₹2,00,000 flagged",
        "High",
        "Investigating",
        "2024-12-07",
      ],
      [
        "ALT003",
        "FRD004",
        "Unusual location-based transaction",
        "Critical",
        "Open",
        "2024-12-08",
      ],
      [
        "ALT004",
        "FRD003",
        "Rapid successive transactions detected",
        "Medium",
        "Resolved",
        "2024-12-05",
      ],
      [
        "ALT005",
        "FRD005",
        "Spending anomaly detected",
        "Low",
        "Resolved",
        "2024-12-06",
      ],
    ])
      insertFa.run(...row);

    for (const row of [
      ["Jul", 320000, 180000, 95000],
      ["Aug", 280000, 210000, 120000],
      ["Sep", 350000, 190000, 88000],
      ["Oct", 410000, 230000, 150000],
      ["Nov", 380000, 260000, 130000],
      ["Dec", 450000, 200000, 110000],
    ])
      insertTt.run(...row);

    for (const row of [
      ["Jul", 12, 10, 3],
      ["Aug", 18, 15, 5],
      ["Sep", 8, 7, 2],
      ["Oct", 22, 18, 4],
      ["Nov", 15, 13, 3],
      ["Dec", 20, 14, 6],
    ])
      insertFt.run(...row);
  });

  tr();
}

export function initDb() {
  runMigrations();
  seed();
  return db;
}

export { db, dbPath };
