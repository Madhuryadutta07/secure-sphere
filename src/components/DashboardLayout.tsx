import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Wallet, ArrowLeftRight, CreditCard, AlertTriangle,
  BarChart3, Settings, Shield, Bell, Search, Menu, X, LogOut, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Wallet, label: "Accounts", path: "/accounts" },
  { icon: ArrowLeftRight, label: "Transactions", path: "/transactions" },
  { icon: CreditCard, label: "Cards", path: "/cards" },
  { icon: AlertTriangle, label: "Fraud Detection", path: "/fraud-detection" },
  { icon: Bell, label: "Fraud Alerts", path: "/fraud-alerts" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Admin", path: "/admin" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col border-r border-sidebar-border bg-sidebar
        transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-[72px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex items-center gap-2 h-16 px-4 border-b border-sidebar-border shrink-0">
          <Shield className="h-7 w-7 text-primary shrink-0" />
          {sidebarOpen && <span className="text-base font-bold text-foreground">Mini Banking</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto hidden lg:block text-muted-foreground hover:text-foreground">
            <ChevronLeft className={`h-4 w-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-4 gap-4">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="bg-secondary/50 border-border/50 pl-10 h-9" />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
