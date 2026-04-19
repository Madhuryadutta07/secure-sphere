import "dotenv/config";
import express from "express";
import cors from "cors";
import { initDb, db } from "./db.js";

initDb();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const defaultOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://[::1]:8080",
];
const extraOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((s) => s.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const allowedOrigins = new Set([...defaultOrigins, ...extraOrigins]);
const vercelOrigin = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
const allowAllVercel =
  process.env.ALLOW_VERCEL_ORIGINS === "1" || process.env.ALLOW_VERCEL_ORIGINS === "true";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      if (allowAllVercel && vercelOrigin.test(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "secure-bank-api", hint: "API routes are under /api/..." });
});

const mapAccount = (row) => ({
  id: row.id,
  customerId: row.customer_id,
  type: row.type,
  balance: row.balance,
  status: row.status,
  created: row.created,
});

const mapTransaction = (row) => ({
  id: row.id,
  accountId: row.account_id,
  type: row.type,
  amount: row.amount,
  date: row.date,
  description: row.description,
  status: row.status,
});

const mapFraudAlert = (row) => ({
  id: row.id,
  fraudId: row.fraud_id,
  message: row.message,
  severity: row.severity,
  status: row.status,
  date: row.date,
});

const mapFraudDetection = (row) => ({
  id: row.id,
  txnId: row.txn_id,
  riskScore: row.risk_score,
  reason: row.reason,
  status: row.status,
  date: row.date,
});

const mapCard = (row) => ({
  id: row.id,
  customerId: row.customer_id,
  number: row.number_masked,
  type: row.type,
  status: row.status,
  limit: row.card_limit,
});

function nextPrefixedId(prefix, table) {
  const ids = db
    .prepare(`SELECT id FROM ${table} WHERE id GLOB ?`)
    .all(`${prefix}*`)
    .map((r) => {
      const n = parseInt(String(r.id).replace(new RegExp(`^${prefix}`, "i"), ""), 10);
      return Number.isNaN(n) ? 0 : n;
    });
  const next = (ids.length ? Math.max(...ids) : 0) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

function randomMaskedCardNumber() {
  const last4 = String(Math.floor(1000 + Math.random() * 9000));
  return `•••• •••• •••• ${last4}`;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "secure-bank-api" });
});

app.get("/api/dashboard/summary", (_req, res) => {
  const totalCustomers = db
    .prepare("SELECT COUNT(*) as c FROM customers")
    .get().c;
  const activeAccounts = db
    .prepare("SELECT COUNT(*) as c FROM accounts WHERE status = 'Active'")
    .get().c;
  const transactionCount = db
    .prepare("SELECT COUNT(*) as c FROM transactions")
    .get().c;
  const openFraudAlerts = db
    .prepare(
      `SELECT COUNT(*) as c FROM fraud_alerts WHERE status IN ('Open', 'Investigating', 'Under Review')`
    )
    .get().c;

  res.json({
    totalCustomers,
    activeAccounts,
    transactionCount,
    openFraudAlerts,
  });
});

app.get("/api/customers", (_req, res) => {
  const rows = db
    .prepare(
      `SELECT c.id, c.name, c.email, c.phone, c.status,
        (SELECT COUNT(*) FROM accounts a WHERE a.customer_id = c.id) as accounts
     FROM customers c
     ORDER BY c.id`
    )
    .all();
  res.json(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      status: r.status,
      accounts: r.accounts,
    }))
  );
});

app.post("/api/customers", (req, res) => {
  const { name, email, phone, status = "Active" } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  const max = db
    .prepare("SELECT id FROM customers WHERE id GLOB 'C*'")
    .all()
    .map((r) => {
      const n = parseInt(String(r.id).replace(/^C/i, ""), 10);
      return Number.isNaN(n) ? 0 : n;
    });
  const next = (max.length ? Math.max(...max) : 0) + 1;
  const id = `C${String(next).padStart(3, "0")}`;
  try {
    db.prepare(
      "INSERT INTO customers (id, name, email, phone, status) VALUES (?, ?, ?, ?, ?)"
    ).run(id, name, email, phone || "", status);
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "Email already registered" });
    }
    throw e;
  }
  const row = db
    .prepare(
      `SELECT c.id, c.name, c.email, c.phone, c.status,
        (SELECT COUNT(*) FROM accounts a WHERE a.customer_id = c.id) as accounts
     FROM customers c WHERE c.id = ?`
    )
    .get(id);
  res.status(201).json({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    accounts: row.accounts,
  });
});

app.put("/api/customers/:id", (req, res) => {
  const id = req.params.id;
  const existing = db.prepare("SELECT id FROM customers WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Customer not found" });
  }
  const { name, email, phone, status = "Active" } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  try {
    db.prepare("UPDATE customers SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?").run(
      name,
      email,
      phone || "",
      status,
      id
    );
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "Email already registered" });
    }
    throw e;
  }
  const row = db
    .prepare(
      `SELECT c.id, c.name, c.email, c.phone, c.status,
        (SELECT COUNT(*) FROM accounts a WHERE a.customer_id = c.id) as accounts
     FROM customers c WHERE c.id = ?`
    )
    .get(id);
  res.json({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    accounts: row.accounts,
  });
});

app.delete("/api/customers/:id", (req, res) => {
  const id = req.params.id;
  const accountCount = db
    .prepare("SELECT COUNT(*) as c FROM accounts WHERE customer_id = ?")
    .get(id).c;
  if (accountCount > 0) {
    return res.status(400).json({ error: "Cannot delete customer with existing accounts" });
  }
  const result = db.prepare("DELETE FROM customers WHERE id = ?").run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: "Customer not found" });
  }
  res.json({ ok: true });
});

app.get("/api/accounts", (_req, res) => {
  const rows = db.prepare("SELECT * FROM accounts ORDER BY id").all();
  res.json(rows.map(mapAccount));
});

app.post("/api/accounts", (req, res) => {
  const { customerId, type, balance, status = "Active" } = req.body;
  if (!customerId || !type || balance === undefined || balance === null) {
    return res.status(400).json({ error: "customerId, type and balance are required" });
  }

  const normalizedCustomerId = String(customerId).trim().toUpperCase();
  const customer = db.prepare("SELECT id FROM customers WHERE id = ?").get(normalizedCustomerId);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const id = nextPrefixedId("ACC", "accounts");
  const created = new Date().toISOString().slice(0, 10);
  const numericBalance = Number(balance);
  if (Number.isNaN(numericBalance) || numericBalance < 0) {
    return res.status(400).json({ error: "balance must be a valid non-negative number" });
  }

  db.prepare(
    "INSERT INTO accounts (id, customer_id, type, balance, status, created) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, normalizedCustomerId, type, numericBalance, status, created);

  const row = db.prepare("SELECT * FROM accounts WHERE id = ?").get(id);
  res.status(201).json(mapAccount(row));
});

app.get("/api/transactions", (_req, res) => {
  const rows = db.prepare("SELECT * FROM transactions ORDER BY date DESC, id DESC").all();
  res.json(rows.map(mapTransaction));
});

app.get("/api/cards", (_req, res) => {
  const rows = db.prepare("SELECT * FROM cards ORDER BY id").all();
  res.json(rows.map(mapCard));
});

app.post("/api/cards", (req, res) => {
  const { customerId, type, limit, status = "Active" } = req.body;
  if (!customerId || !type || limit === undefined || limit === null) {
    return res.status(400).json({ error: "customerId, type and limit are required" });
  }

  const normalizedCustomerId = String(customerId).trim().toUpperCase();
  const customer = db.prepare("SELECT id FROM customers WHERE id = ?").get(normalizedCustomerId);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const numericLimit = Number(limit);
  if (Number.isNaN(numericLimit) || numericLimit <= 0) {
    return res.status(400).json({ error: "limit must be a valid positive number" });
  }

  const id = nextPrefixedId("CARD", "cards");
  const maskedNumber = randomMaskedCardNumber();
  db.prepare(
    "INSERT INTO cards (id, customer_id, number_masked, type, status, card_limit) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, normalizedCustomerId, maskedNumber, type, status, numericLimit);

  const row = db.prepare("SELECT * FROM cards WHERE id = ?").get(id);
  res.status(201).json(mapCard(row));
});

app.get("/api/fraud-detections", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM fraud_detections ORDER BY date DESC, id DESC")
    .all();
  res.json(rows.map(mapFraudDetection));
});

app.get("/api/fraud-alerts", (_req, res) => {
  const rows = db.prepare("SELECT * FROM fraud_alerts ORDER BY date DESC, id DESC").all();
  res.json(rows.map(mapFraudAlert));
});

app.get("/api/reports/transaction-trends", (_req, res) => {
  const rows = db
    .prepare(
      "SELECT month_label, credits, debits, transfers FROM transaction_trends ORDER BY id"
    )
    .all();
  res.json(
    rows.map((r) => ({
      month: r.month_label,
      credits: r.credits,
      debits: r.debits,
      transfers: r.transfers,
    }))
  );
});

app.get("/api/reports/fraud-trends", (_req, res) => {
  const rows = db
    .prepare("SELECT month_label, detected, resolved, false_positive FROM fraud_trends ORDER BY id")
    .all();
  res.json(
    rows.map((r) => ({
      month: r.month_label,
      detected: r.detected,
      resolved: r.resolved,
      falsePositive: r.false_positive,
    }))
  );
});

/** Demo auth — replace with real auth in production. */
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  res.json({ ok: true, token: "demo-session", user: { email: String(email).toLowerCase() } });
});

app.post("/api/auth/signup", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  res.json({
    ok: true,
    token: "demo-session",
    user: { email: String(email).toLowerCase(), name: name || "" },
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
