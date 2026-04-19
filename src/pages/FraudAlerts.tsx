import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle } from "lucide-react";

const severityStyle: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive border border-destructive/20",
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-success/10 text-success",
};

const FraudAlerts = () => {
  const { data: fraudAlerts = [] } = useQuery({ queryKey: ["fraud-alerts"], queryFn: api.getFraudAlerts });
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Fraud Alerts</h1>
          <p className="text-sm text-muted-foreground">Review and manage fraud alerts</p>
        </div>

        <div className="space-y-3">
          {fraudAlerts.map((alert) => (
            <div key={alert.id} className={`glass-card p-5 transition-all ${
              alert.severity === "Critical" ? "border-l-4 border-l-destructive" :
              alert.severity === "High" ? "border-l-4 border-l-destructive/60" :
              ""
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{alert.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${severityStyle[alert.severity]}`}>
                      {alert.severity}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      alert.status === "Resolved" ? "bg-success/10 text-success" :
                      alert.status === "Investigating" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    }`}>{alert.status}</span>
                  </div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                </div>
                {alert.status !== "Resolved" && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-border/50 text-xs h-8">
                      <Search className="h-3 w-3 mr-1" /> Investigate
                    </Button>
                    <Button size="sm" className="bg-success/10 text-success hover:bg-success/20 border-0 text-xs h-8">
                      <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FraudAlerts;
