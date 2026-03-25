import DashboardLayout from "@/components/DashboardLayout";
import { fraudDetections } from "@/lib/mockData";
import { AlertTriangle } from "lucide-react";

const getRiskColor = (score: number) => {
  if (score >= 80) return "text-destructive bg-destructive/10";
  if (score >= 60) return "text-warning bg-warning/10";
  return "text-success bg-success/10";
};

const getRiskBarColor = (score: number) => {
  if (score >= 80) return "bg-destructive";
  if (score >= 60) return "bg-warning";
  return "bg-success";
};

const FraudDetection = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Fraud Detection</h1>
          <p className="text-sm text-muted-foreground">Monitor suspicious transactions and risk scores</p>
        </div>

        {/* Risk summary */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 border-l-4 border-l-destructive">
            <div className="text-sm text-muted-foreground mb-1">High Risk</div>
            <div className="text-2xl font-bold text-destructive">{fraudDetections.filter(f => f.riskScore >= 80).length}</div>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-warning">
            <div className="text-sm text-muted-foreground mb-1">Medium Risk</div>
            <div className="text-2xl font-bold text-warning">{fraudDetections.filter(f => f.riskScore >= 60 && f.riskScore < 80).length}</div>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-success">
            <div className="text-sm text-muted-foreground mb-1">Resolved</div>
            <div className="text-2xl font-bold text-success">{fraudDetections.filter(f => f.status === "Resolved").length}</div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Transaction</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Risk Score</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Reason</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {fraudDetections.map((f) => (
                  <tr key={f.id} className={`border-b border-border/30 hover:bg-secondary/20 transition-colors ${
                    f.riskScore >= 80 ? "bg-destructive/5" : ""
                  }`}>
                    <td className="py-3 px-4 font-mono text-xs">{f.id}</td>
                    <td className="py-3 px-4 font-mono text-xs">{f.txnId}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${getRiskBarColor(f.riskScore)}`} style={{ width: `${f.riskScore}%` }} />
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRiskColor(f.riskScore)}`}>
                          {f.riskScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{f.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        f.status === "Resolved" ? "bg-success/10 text-success" :
                        f.status === "Investigating" ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {f.riskScore >= 80 && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{f.date}</td>
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

export default FraudDetection;
