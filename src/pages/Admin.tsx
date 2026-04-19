import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Users, Shield, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const Admin = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [riskThreshold, setRiskThreshold] = useState("80");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backupName, setBackupName] = useState("");

  const modules = [
    { icon: Users, title: "User Management", desc: "Review and manage access for dashboard users" },
    { icon: Shield, title: "Security Settings", desc: "Tune fraud detection risk thresholds" },
    { icon: Database, title: "Database", desc: "Create and validate backup snapshots" },
    { icon: Settings, title: "System Config", desc: "Toggle maintenance mode and system behavior" },
  ];

  const runAction = (action: string) => {
    if (action === "saveThreshold") {
      const threshold = Number(riskThreshold);
      if (Number.isNaN(threshold) || threshold < 1 || threshold > 100) {
        toast.error("Risk threshold must be between 1 and 100");
        return;
      }
      toast.success(`Fraud risk threshold updated to ${threshold}`);
      return;
    }
    if (action === "createBackup") {
      const normalizedName = backupName.trim() || `backup-${new Date().toISOString().slice(0, 10)}`;
      setBackupName(normalizedName);
      toast.success(`Backup '${normalizedName}' created`);
      return;
    }
    if (action === "toggleMaintenance") {
      const next = !maintenanceMode;
      setMaintenanceMode(next);
      toast.success(next ? "Maintenance mode enabled" : "Maintenance mode disabled");
      return;
    }
    toast.success("Action completed");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">System settings and administration</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((item, i) => (
            <button
              key={item.title}
              className="glass-card-hover p-6 cursor-pointer group text-left"
              onClick={() => setActiveModule(item.title)}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </button>
          ))}
        </div>

        <Dialog open={Boolean(activeModule)} onOpenChange={(open) => !open && setActiveModule(null)}>
          <DialogContent className="glass-card border-border/30">
            <DialogHeader>
              <DialogTitle>{activeModule ?? "Admin Action"}</DialogTitle>
            </DialogHeader>
            {activeModule === "User Management" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  User management tools are in demo mode. Use the actions below to simulate access workflows.
                </p>
                <Button className="w-full" onClick={() => runAction("grantAccess")}>
                  Grant analyst role
                </Button>
                <Button variant="outline" className="w-full" onClick={() => runAction("revokeAccess")}>
                  Revoke inactive user
                </Button>
              </div>
            )}
            {activeModule === "Security Settings" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Fraud risk threshold</Label>
                  <Input
                    type="number"
                    value={riskThreshold}
                    min={1}
                    max={100}
                    onChange={(e) => setRiskThreshold(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={() => runAction("saveThreshold")}>
                  Save threshold
                </Button>
              </div>
            )}
            {activeModule === "Database" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Backup name</Label>
                  <Input
                    placeholder="e.g. nightly-backup"
                    value={backupName}
                    onChange={(e) => setBackupName(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={() => runAction("createBackup")}>
                  Create backup
                </Button>
                <Button variant="outline" className="w-full" onClick={() => runAction("verifyBackup")}>
                  Verify latest backup
                </Button>
              </div>
            )}
            {activeModule === "System Config" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Maintenance mode currently:{" "}
                  <span className="font-medium">{maintenanceMode ? "Enabled" : "Disabled"}</span>
                </p>
                <Button className="w-full" onClick={() => runAction("toggleMaintenance")}>
                  {maintenanceMode ? "Disable maintenance mode" : "Enable maintenance mode"}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => runAction("refreshCaches")}>
                  Refresh system caches
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
