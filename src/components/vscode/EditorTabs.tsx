import { X, FileText, LayoutDashboard, Wifi, Globe, Bell, Navigation, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  route: string;
  icon: React.ReactNode;
  iconColor: string;
  modified?: boolean;
}

const allTabs: Tab[] = [
  {
    id: "home",
    label: "index.tsx",
    route: "/",
    icon: <Home size={14} />,
    iconColor: "text-[#519aba]",
  },
  {
    id: "dashboard",
    label: "overview.tsx",
    route: "/dashboard",
    icon: <LayoutDashboard size={14} />,
    iconColor: "text-[#519aba]",
    modified: true,
  },
  {
    id: "iot",
    label: "iot-sensors.tsx",
    route: "/dashboard/iot",
    icon: <Wifi size={14} />,
    iconColor: "text-[#519aba]",
  },
  {
    id: "geo",
    label: "geoinformation.tsx",
    route: "/dashboard/geo",
    icon: <Globe size={14} />,
    iconColor: "text-[#519aba]",
  },
  {
    id: "alerts",
    label: "alerts-center.tsx",
    route: "/dashboard/alerts",
    icon: <Bell size={14} />,
    iconColor: "text-[#519aba]",
  },
  {
    id: "tracking",
    label: "gps-tracking.tsx",
    route: "/dashboard/tracking",
    icon: <Navigation size={14} />,
    iconColor: "text-[#519aba]",
  },
];

const EditorTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRoute = location.pathname;

  return (
    <div
      className="flex items-end h-[35px] overflow-x-auto select-none"
      style={{ background: "hsl(var(--vscode-tab-border))" }}
    >
      {allTabs.map((tab) => {
        const isActive = tab.route === currentRoute;
        return (
          <button
            key={tab.id}
            className={`group relative flex items-center gap-1.5 h-[35px] px-3 min-w-[120px] max-w-[200px] text-[13px] border-r border-r-[hsl(220,13%,11%)] transition-colors ${
              isActive
                ? "text-white bg-[hsl(var(--vscode-tab-active))]"
                : "text-[hsl(0,0%,55%)] bg-[hsl(var(--vscode-tab-inactive))] hover:bg-[hsl(220,13%,16%)]"
            }`}
            onClick={() => navigate(tab.route)}
          >
            {/* Active top border */}
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-[hsl(207,90%,54%)]" />
            )}
            <span className={`shrink-0 ${tab.iconColor}`}>{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
            {/* Modified dot or close button */}
            <span className="ml-auto shrink-0 w-[16px] h-[16px] flex items-center justify-center">
              {tab.modified && !isActive ? (
                <span className="w-[8px] h-[8px] rounded-full bg-[hsl(0,0%,55%)]" />
              ) : (
                <span className="hidden group-hover:flex items-center justify-center rounded-sm hover:bg-[hsl(220,13%,30%)]">
                  <X size={14} />
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default EditorTabs;
