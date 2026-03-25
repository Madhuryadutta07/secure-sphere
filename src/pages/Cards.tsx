import DashboardLayout from "@/components/DashboardLayout";
import { CreditCard } from "lucide-react";

const cards = [
  { id: "CARD001", number: "•••• •••• •••• 4521", type: "Visa Debit", status: "Active", limit: 200000, customerId: "C001" },
  { id: "CARD002", number: "•••• •••• •••• 8734", type: "Mastercard Credit", status: "Active", limit: 500000, customerId: "C002" },
  { id: "CARD003", number: "•••• •••• •••• 1290", type: "Visa Credit", status: "Blocked", limit: 300000, customerId: "C003" },
  { id: "CARD004", number: "•••• •••• •••• 5678", type: "Rupay Debit", status: "Active", limit: 100000, customerId: "C004" },
];

const Cards = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Cards</h1>
          <p className="text-sm text-muted-foreground">Manage debit and credit cards</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div key={card.id} className="glass-card-hover p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    card.status === "Active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>{card.status}</span>
                </div>
                <div className="text-lg font-mono tracking-widest mb-4">{card.number}</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Type</div>
                    <div className="text-sm font-medium">{card.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Limit</div>
                    <div className="text-sm font-medium">₹{card.limit.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Cards;
