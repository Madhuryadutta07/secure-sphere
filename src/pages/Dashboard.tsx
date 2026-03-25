import DashboardLayout from "@/components/DashboardLayout";
import { Users, Wallet, ArrowLeftRight, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { transactionTrends, fraudTrends, transactions } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const summaryCards = [
  { label: "Total Customers", value: "1,248", change: "+12%", icon: Users, trend: "up" },
  { label: "Active Accounts", value: "3,672", change: "+8%", icon: Wallet, trend: "up" },
  { label: "Transactions", value: "24.5K", change: "+18%", icon: ArrowLeftRight, trend: "up" },
  { label: "Fraud Alerts", value: "23", change: "-5%", icon: AlertTriangle, trend: "down" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your banking system</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, i) => (
            <div key={i} className="glass-card-hover p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${
                  card.trend === "up" ? "text-success" : "text-destructive"
                }`}>
                  {card.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4">Transaction Trends</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={transactionTrends}>
                <defs>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(173, 80%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(173, 80%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDebits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(250, 70%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(250, 70%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip
                  contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }}
                  labelStyle={{ color: "hsl(210, 40%, 96%)" }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                />
                <Area type="monotone" dataKey="credits" stroke="hsl(173, 80%, 50%)" fill="url(#colorCredits)" strokeWidth={2} name="Credits" />
                <Area type="monotone" dataKey="debits" stroke="hsl(250, 70%, 60%)" fill="url(#colorDebits)" strokeWidth={2} name="Debits" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4">Fraud Detection Overview</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={fraudTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }}
                  labelStyle={{ color: "hsl(210, 40%, 96%)" }}
                />
                <Bar dataKey="detected" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} name="Detected" />
                <Bar dataKey="resolved" fill="hsl(152, 69%, 45%)" radius={[4, 4, 0, 0]} name="Resolved" />
                <Bar dataKey="falsePositive" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} name="False Positive" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Description</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((txn) => (
                  <tr key={txn.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs">{txn.id}</td>
                    <td className="py-3 px-4">{txn.description}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        txn.type === "Credit" ? "bg-success/10 text-success" :
                        txn.type === "Debit" ? "bg-destructive/10 text-destructive" :
                        "bg-accent/10 text-accent"
                      }`}>{txn.type}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">₹{txn.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        txn.status === "Completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}>{txn.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
