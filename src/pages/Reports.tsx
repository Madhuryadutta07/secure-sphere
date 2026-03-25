import DashboardLayout from "@/components/DashboardLayout";
import { transactionTrends, fraudTrends } from "@/lib/mockData";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line
} from "recharts";

const pieData = [
  { name: "Savings", value: 62 },
  { name: "Current", value: 38 },
];
const COLORS = ["hsl(173, 80%, 50%)", "hsl(250, 70%, 60%)"];

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Reports</h1>
            <p className="text-sm text-muted-foreground">Analytics and insights</p>
          </div>
          <Button variant="outline" className="border-border/50">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4">Revenue Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={transactionTrends}>
                <defs>
                  <linearGradient id="rCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(173, 80%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(173, 80%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="credits" stroke="hsl(173, 80%, 50%)" fill="url(#rCredits)" strokeWidth={2} name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4">Account Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4">Fraud Detection Rate</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={fraudTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="detected" stroke="hsl(0, 72%, 55%)" strokeWidth={2} dot={{ r: 3 }} name="Detected" />
                <Line type="monotone" dataKey="resolved" stroke="hsl(152, 69%, 45%)" strokeWidth={2} dot={{ r: 3 }} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4">Monthly Transactions Volume</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={transactionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }} />
                <Bar dataKey="credits" fill="hsl(173, 80%, 50%)" radius={[4, 4, 0, 0]} name="Credits" />
                <Bar dataKey="debits" fill="hsl(250, 70%, 60%)" radius={[4, 4, 0, 0]} name="Debits" />
                <Bar dataKey="transfers" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} name="Transfers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
