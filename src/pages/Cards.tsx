import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { CreditCard, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Cards = () => {
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardLimit, setCardLimit] = useState("");
  const queryClient = useQueryClient();
  const { data: cards = [] } = useQuery({ queryKey: ["cards"], queryFn: api.getCards });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: api.getCustomers });
  const addCard = useMutation({
    mutationFn: () =>
      api.addCard({
        customerId: customerId.trim().toUpperCase(),
        type: cardType,
        limit: Number(cardLimit || 0),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setShowForm(false);
      setCustomerId("");
      setCardType("");
      setCardLimit("");
      toast.success("Card issued");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Cards</h1>
            <p className="text-sm text-muted-foreground">Manage debit and credit cards</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Issue Card
          </Button>
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

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="glass-card border-border/30">
            <DialogHeader>
              <DialogTitle>Issue New Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Customer ID</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.id} - {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose a valid customer to avoid lookup errors.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Card Type</Label>
                <Select value={cardType} onValueChange={setCardType}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visa Debit">Visa Debit</SelectItem>
                    <SelectItem value="Mastercard Credit">Mastercard Credit</SelectItem>
                    <SelectItem value="Visa Credit">Visa Credit</SelectItem>
                    <SelectItem value="Rupay Debit">Rupay Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Card Limit</Label>
                <Input
                  className="bg-secondary/50 border-border/50"
                  placeholder="₹100000"
                  type="number"
                  value={cardLimit}
                  onChange={(e) => setCardLimit(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-gradient-primary text-primary-foreground"
                disabled={addCard.isPending}
                onClick={() => addCard.mutate()}
              >
                {addCard.isPending ? "Issuing…" : "Issue Card"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Cards;
