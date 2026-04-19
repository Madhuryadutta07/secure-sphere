import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { CreditCard } from "lucide-react";

const Cards = () => {
  const { data: cards = [] } = useQuery({ queryKey: ["cards"], queryFn: api.getCards });
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
