export const customers = [
  { id: "C001", name: "Aarav Sharma", email: "aarav@mail.com", phone: "+91 98765 43210", status: "Active", accounts: 2 },
  { id: "C002", name: "Priya Patel", email: "priya@mail.com", phone: "+91 87654 32109", status: "Active", accounts: 1 },
  { id: "C003", name: "Rahul Kumar", email: "rahul@mail.com", phone: "+91 76543 21098", status: "Inactive", accounts: 3 },
  { id: "C004", name: "Sneha Gupta", email: "sneha@mail.com", phone: "+91 65432 10987", status: "Active", accounts: 1 },
  { id: "C005", name: "Vikram Singh", email: "vikram@mail.com", phone: "+91 54321 09876", status: "Active", accounts: 2 },
  { id: "C006", name: "Ananya Reddy", email: "ananya@mail.com", phone: "+91 43210 98765", status: "Active", accounts: 1 },
];

export const accounts = [
  { id: "ACC001", customerId: "C001", type: "Savings", balance: 125000.50, status: "Active", created: "2024-01-15" },
  { id: "ACC002", customerId: "C001", type: "Current", balance: 450000.00, status: "Active", created: "2024-02-20" },
  { id: "ACC003", customerId: "C002", type: "Savings", balance: 87500.25, status: "Active", created: "2024-03-10" },
  { id: "ACC004", customerId: "C003", type: "Savings", balance: 12000.00, status: "Frozen", created: "2024-01-05" },
  { id: "ACC005", customerId: "C004", type: "Current", balance: 340000.75, status: "Active", created: "2024-04-18" },
  { id: "ACC006", customerId: "C005", type: "Savings", balance: 95000.00, status: "Active", created: "2024-05-22" },
];

export const transactions = [
  { id: "TXN001", accountId: "ACC001", type: "Credit", amount: 50000, date: "2024-12-01", description: "Salary Deposit", status: "Completed" },
  { id: "TXN002", accountId: "ACC002", type: "Debit", amount: 15000, date: "2024-12-02", description: "Bill Payment", status: "Completed" },
  { id: "TXN003", accountId: "ACC003", type: "Transfer", amount: 25000, date: "2024-12-03", description: "Fund Transfer", status: "Completed" },
  { id: "TXN004", accountId: "ACC001", type: "Debit", amount: 120000, date: "2024-12-04", description: "Large Withdrawal", status: "Flagged" },
  { id: "TXN005", accountId: "ACC005", type: "Credit", amount: 75000, date: "2024-12-05", description: "Investment Return", status: "Completed" },
  { id: "TXN006", accountId: "ACC004", type: "Debit", amount: 8000, date: "2024-12-06", description: "ATM Withdrawal", status: "Completed" },
  { id: "TXN007", accountId: "ACC002", type: "Transfer", amount: 200000, date: "2024-12-07", description: "Wire Transfer", status: "Flagged" },
  { id: "TXN008", accountId: "ACC006", type: "Credit", amount: 30000, date: "2024-12-08", description: "Refund", status: "Completed" },
];

export const fraudDetections = [
  { id: "FRD001", txnId: "TXN004", riskScore: 92, reason: "Unusual large withdrawal from savings", status: "Under Review", date: "2024-12-04" },
  { id: "FRD002", txnId: "TXN007", riskScore: 88, reason: "High-value wire transfer to new beneficiary", status: "Investigating", date: "2024-12-07" },
  { id: "FRD003", txnId: "TXN009", riskScore: 75, reason: "Multiple transactions in short timeframe", status: "Resolved", date: "2024-12-05" },
  { id: "FRD004", txnId: "TXN010", riskScore: 95, reason: "Transaction from unusual geographic location", status: "Under Review", date: "2024-12-08" },
  { id: "FRD005", txnId: "TXN011", riskScore: 60, reason: "Deviation from spending pattern", status: "Resolved", date: "2024-12-06" },
];

export const fraudAlerts = [
  { id: "ALT001", fraudId: "FRD001", message: "Suspicious withdrawal of ₹1,20,000 detected", severity: "High", status: "Open", date: "2024-12-04" },
  { id: "ALT002", fraudId: "FRD002", message: "Wire transfer of ₹2,00,000 flagged", severity: "High", status: "Investigating", date: "2024-12-07" },
  { id: "ALT003", fraudId: "FRD004", message: "Unusual location-based transaction", severity: "Critical", status: "Open", date: "2024-12-08" },
  { id: "ALT004", fraudId: "FRD003", message: "Rapid successive transactions detected", severity: "Medium", status: "Resolved", date: "2024-12-05" },
  { id: "ALT005", fraudId: "FRD005", message: "Spending anomaly detected", severity: "Low", status: "Resolved", date: "2024-12-06" },
];

export const transactionTrends = [
  { month: "Jul", credits: 320000, debits: 180000, transfers: 95000 },
  { month: "Aug", credits: 280000, debits: 210000, transfers: 120000 },
  { month: "Sep", credits: 350000, debits: 190000, transfers: 88000 },
  { month: "Oct", credits: 410000, debits: 230000, transfers: 150000 },
  { month: "Nov", credits: 380000, debits: 260000, transfers: 130000 },
  { month: "Dec", credits: 450000, debits: 200000, transfers: 110000 },
];

export const fraudTrends = [
  { month: "Jul", detected: 12, resolved: 10, falsePositive: 3 },
  { month: "Aug", detected: 18, resolved: 15, falsePositive: 5 },
  { month: "Sep", detected: 8, resolved: 7, falsePositive: 2 },
  { month: "Oct", detected: 22, resolved: 18, falsePositive: 4 },
  { month: "Nov", detected: 15, resolved: 13, falsePositive: 3 },
  { month: "Dec", detected: 20, resolved: 14, falsePositive: 6 },
];
