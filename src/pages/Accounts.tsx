import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { accounts } from "@/lib/mockData";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Accounts = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Accounts</h1>
            <p className="text-sm text-muted-foreground">Manage bank accounts</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Create Account
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div key={acc.id} className="glass-card-hover p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-muted-foreground">{acc.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  acc.status === "Active" ? "bg-success/10 text-success" :
                  "bg-destructive/10 text-destructive"
                }`}>{acc.status}</span>
              </div>
              <div className="text-2xl font-bold mb-1">₹{acc.balance.toLocaleString()}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{acc.type} Account</span>
                <span className="text-xs text-muted-foreground">Customer: {acc.customerId}</span>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="glass-card border-border/30">
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Customer ID</Label>
                <Input className="bg-secondary/50 border-border/50" placeholder="e.g. C001" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Account Type</Label>
                <Select>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Initial Deposit</Label>
                <Input className="bg-secondary/50 border-border/50" placeholder="₹0.00" type="number" />
              </div>
              <Button className="w-full bg-gradient-primary text-primary-foreground">Create Account</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;
