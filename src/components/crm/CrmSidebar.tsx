import { LayoutDashboard, Users, Home, Calendar, Settings, TrendingUp, LogOut, Bot, DollarSign, File } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "../ui/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Início", path: "/" },
  { icon: Users, label: "Leads", path: "/leads" },
  { icon: Home, label: "Imóveis", path: "/properties" },
  { icon: Calendar, label: "Calendário", path: "/visits" },
  { icon: Bot, label: "IA", path: "/ai" },
  { icon: DollarSign, label: "Transações", path: "/transactions" },
  { icon: File, label: "Documentos", path: "/documents" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

interface CrmSidebarProps {
  activeItem?: string;
}

const CrmSidebar = ({ activeItem }: CrmSidebarProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getIsActive = (item: typeof navItems[0]) => {
    if (activeItem) return item.label === activeItem;
    if (item.path !== "/" && location.pathname.startsWith(item.path)) return true;
    if (item.label === "Dashboard") return location.pathname === "/";
    return false;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");

    toast({
      title: "Sucesso",
      description: "Você saiu da sua conta!",
    });
  };

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-accent-foreground">{user.name}</h1>
            <p className="text-[11px] text-sidebar-foreground/60">AIMOB</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = getIsActive(item);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{user?.name || "Usuário"}</p>
            <p className="text-[11px] text-sidebar-foreground/60 truncate">{user?.role === "admin" ? "Admin" : "Agent"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CrmSidebar;
