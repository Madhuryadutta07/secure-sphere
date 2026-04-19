const rawBase = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
const base = rawBase.replace(/\/+$/, "");

async function parseJson<T>(input: Response | Promise<Response>): Promise<T> {
  const r = await input;
  const text = await r.text();
  if (!r.ok) {
    let err = text;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j.error) err = j.error;
    } catch {
      /* use raw */
    }
    throw new Error(err);
  }
  return (text ? JSON.parse(text) : ({} as T)) as T;
}

export function getJson<T>(path: string) {
  return parseJson<T>(fetch(`${base}${path}`, { credentials: "include" }));
}

export function postJson<T, B = unknown>(path: string, body: B) {
  return parseJson<T>(
    fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    })
  );
}

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  accounts: number;
};

export type BankAccount = {
  id: string;
  customerId: string;
  type: string;
  balance: number;
  status: string;
  created: string;
};

export type BankTransaction = {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  date: string;
  description: string;
  status: string;
};

export type Card = {
  id: string;
  customerId: string;
  number: string;
  type: string;
  status: string;
  limit: number;
};

export type FraudDetection = {
  id: string;
  txnId: string;
  riskScore: number;
  reason: string;
  status: string;
  date: string;
};

export type FraudAlert = {
  id: string;
  fraudId: string;
  message: string;
  severity: string;
  status: string;
  date: string;
};

export type TransactionTrend = {
  month: string;
  credits: number;
  debits: number;
  transfers: number;
};

export type FraudTrend = {
  month: string;
  detected: number;
  resolved: number;
  falsePositive: number;
};

export type DashboardSummary = {
  totalCustomers: number;
  activeAccounts: number;
  transactionCount: number;
  openFraudAlerts: number;
};

export const api = {
  getSummary: () => getJson<DashboardSummary>("/api/dashboard/summary"),
  getCustomers: () => getJson<Customer[]>("/api/customers"),
  addCustomer: (b: { name: string; email: string; phone: string; status?: string }) =>
    postJson<Customer>("/api/customers", b),
  getAccounts: () => getJson<BankAccount[]>("/api/accounts"),
  getTransactions: () => getJson<BankTransaction[]>("/api/transactions"),
  getCards: () => getJson<Card[]>("/api/cards"),
  getFraudDetections: () => getJson<FraudDetection[]>("/api/fraud-detections"),
  getFraudAlerts: () => getJson<FraudAlert[]>("/api/fraud-alerts"),
  getTransactionTrends: () => getJson<TransactionTrend[]>("/api/reports/transaction-trends"),
  getFraudTrends: () => getJson<FraudTrend[]>("/api/reports/fraud-trends"),
  login: (b: { email: string; password: string }) =>
    postJson<{ ok: boolean; token: string }>("/api/auth/login", b),
  signup: (b: { email: string; password: string; name: string }) =>
    postJson<{ ok: boolean; token: string }>("/api/auth/signup", b),
};
