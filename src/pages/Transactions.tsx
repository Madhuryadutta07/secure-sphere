import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Transactions = () => {
  const [filterType, setFilterType] = useState("all");
  const { data: transactions = [] } = useQuery({ queryKey: ["transactions"], queryFn: api.getTransactions });

  const filtered = useMemo(
    () =>
      filterType === "all"
        ? transactions
        : transactions.filter((t) => t.type.toLowerCase() === filterType),
    [transactions, filterType]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Transactions</h1>
            <p className="text-sm text-muted-foreground">View and manage transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-success/10 text-success hover:bg-success/20 border-0">
              <ArrowDownLeft className="h-3.5 w-3.5 mr-1" /> Deposit
            </Button>
            <Button size="sm" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">
              <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Withdraw
            </Button>
            <Button size="sm" className="bg-accent/10 text-accent hover:bg-accent/20 border-0">
              <ArrowLeftRight className="h-3.5 w-3.5 mr-1" /> Transfer
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Input className="bg-secondary/50 border-border/50 w-40 h-9" placeholder="Date from" type="date" />
          <Input className="bg-secondary/50 border-border/50 w-40 h-9" placeholder="Date to" type="date" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-secondary/50 border-border/50 w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
          <Input className="bg-secondary/50 border-border/50 w-36 h-9" placeholder="Min amount" type="number" />
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Description</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Account</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn) => (
                  <tr key={txn.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs">{txn.id}</td>
                    <td className="py-3 px-4 text-muted-foreground">{txn.date}</td>
                    <td className="py-3 px-4">{txn.description}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        txn.type === "Credit" ? "bg-success/10 text-success" :
                        txn.type === "Debit" ? "bg-destructive/10 text-destructive" :
                        "bg-accent/10 text-accent"
                      }`}>{txn.type}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">₹{txn.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{txn.accountId}</td>
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

export default Transactions;
