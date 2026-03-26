import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Wifi, Globe, Bell, Navigation } from "lucide-react";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Início", route: "/dashboard" },
  { id: "iot",       icon: Wifi,            label: "IoT",    route: "/dashboard/iot",      badge: 6 },
  { id: "geo",       icon: Globe,           label: "Geo",    route: "/dashboard/geo" },
  { id: "alerts",    icon: Bell,            label: "Alertas",route: "/dashboard/alerts",   badge: 2 },
  { id: "tracking",  icon: Navigation,      label: "GPS",    route: "/dashboard/tracking" },
];

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex items-center justify-around h-[56px] border-t border-[hsl(220,13%,22%)] shrink-0"
      style={{ background: "hsl(var(--vscode-activitybar))" }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          location.pathname === item.route ||
          (item.route !== "/dashboard" && location.pathname.startsWith(item.route));

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.route)}
            className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
              isActive ? "text-white" : "text-[hsl(0,0%,45%)] active:text-[hsl(0,0%,75%)]"
            }`}
          >
            {/* Indicador ativo no topo */}
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[hsl(207,90%,54%)] rounded-b" />
            )}

            <div className="relative">
              <Icon size={20} />
              {item.badge && (
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-[hsl(207,90%,54%)] text-white text-[9px] font-bold px-0.5">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-none font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
