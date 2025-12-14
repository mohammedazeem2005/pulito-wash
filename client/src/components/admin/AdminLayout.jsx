import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Shirt,
  Users,
  Ticket,
  BarChart3,
  LogOut,
  Menu,
  Moon,
  Sun,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/orders", label: "Orders", icon: Package },
  { path: "/admin/services", label: "Services", icon: Shirt },
  { path: "/admin/customers", label: "Customers", icon: Users },
  { path: "/admin/coupons", label: "Coupons", icon: Ticket },
  { path: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminLayout({ children }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between gap-2">
          {sidebarOpen && (
            <Link href="/admin">
              <span className="font-[Poppins] font-bold text-xl bg-gradient-to-r from-[#0077FF] to-[#00C2FF] bg-clip-text text-transparent">
                Pulito Admin
              </span>
            </Link>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="button-toggle-sidebar"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
                      : "text-muted-foreground hover-elevate"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="font-[Inter] font-medium">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Button
            variant="ghost"
            className={`w-full ${sidebarOpen ? "justify-start" : "justify-center"}`}
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {sidebarOpen && <span className="ml-3 font-[Inter]">Theme</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full text-destructive ${sidebarOpen ? "justify-start" : "justify-center"}`}
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3 font-[Inter]">Logout</span>}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="font-[Poppins] font-semibold text-xl text-foreground">
            {navItems.find((item) => 
              location === item.path || (item.path !== "/admin" && location.startsWith(item.path))
            )?.label || "Admin"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-[Inter] text-sm text-muted-foreground">
              Welcome, {user?.name || "Admin"}
            </span>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
