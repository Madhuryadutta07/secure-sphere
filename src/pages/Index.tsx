import { Shield, CreditCard, BarChart3, Lock, ArrowRight, Zap, Eye, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  { icon: CreditCard, title: "Account Management", desc: "Create and manage multiple bank accounts with real-time balance tracking." },
  { icon: Zap, title: "Fast Transactions", desc: "Process deposits, withdrawals, and transfers with instant confirmation." },
  { icon: Eye, title: "Fraud Detection", desc: "AI-powered risk scoring identifies suspicious transactions in real-time." },
  { icon: Lock, title: "Secure System", desc: "Enterprise-grade security with encrypted data and audit logging." },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "< 50ms", label: "Detection Speed" },
  { value: "10K+", label: "Transactions/sec" },
  { value: "0.01%", label: "False Positives" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold text-foreground">Mini Banking</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stats</a>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground">Login</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground font-semibold">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8 animate-fade-in">
              <Bell className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Real-time Fraud Monitoring</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Secure Banking &{" "}
              <span className="text-gradient-primary">Fraud Detection</span>{" "}
              System
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Smart transaction monitoring powered by intelligent risk analysis. Protect accounts, detect anomalies, and manage banking operations seamlessly.
            </p>
            <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/login">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground font-semibold px-8 glow-primary">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="glass-card p-6 text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-2xl md:text-3xl font-bold text-gradient-primary mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Everything You Need</h2>
            <p className="text-muted-foreground max-w-md mx-auto">A complete banking management system with built-in fraud detection capabilities.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card-hover p-6 group animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">Experience next-generation banking security with our fraud detection system.</p>
              <Link to="/login">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground font-semibold px-8">
                  Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">SecureBank</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SecureBank. Mini Banking & Fraud Detection System — DBMS Project.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
