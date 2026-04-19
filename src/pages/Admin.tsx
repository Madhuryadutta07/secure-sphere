import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Users, Shield, Database } from "lucide-react";

const Admin = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">System settings and administration</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Users, title: "User Management", desc: "Manage admin users and permissions" },
            { icon: Shield, title: "Security Settings", desc: "Configure fraud detection thresholds" },
            { icon: Database, title: "Database", desc: "View database stats and backup settings" },
            { icon: Settings, title: "System Config", desc: "General system configuration" },
          ].map((item, i) => (
            <div key={i} className="glass-card-hover p-6 cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
