import {
  LayoutDashboard,
  Search,
  GitBranch,
  Wifi,
  Globe,
  Bell,
  Navigation,
  Settings,
  User,
  Bug,
  Blocks,
} from "lucide-react";

interface ActivityBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const topItems: ActivityItem[] = [
  {
    id: "explorer",
    icon: <LayoutDashboard size={24} />,
    label: "Explorer",
  },
  {
    id: "search",
    icon: <Search size={24} />,
    label: "Search",
  },
  {
    id: "git",
    icon: <GitBranch size={24} />,
    label: "Source Control",
    badge: 3,
  },
  {
    id: "iot",
    icon: <Wifi size={24} />,
    label: "IoT Sensors",
    badge: 6,
  },
  {
    id: "geo",
    icon: <Globe size={24} />,
    label: "Geoinformation",
  },
  {
    id: "alerts",
    icon: <Bell size={24} />,
    label: "Alerts",
    badge: 2,
  },
  {
    id: "tracking",
    icon: <Navigation size={24} />,
    label: "GPS Tracking",
  },
  {
    id: "debug",
    icon: <Bug size={24} />,
    label: "Run & Debug",
  },
  {
    id: "extensions",
    icon: <Blocks size={24} />,
    label: "Extensions",
  },
];

const bottomItems: ActivityItem[] = [
  {
    id: "account",
    icon: <User size={24} />,
    label: "Account",
  },
  {
    id: "settings",
    icon: <Settings size={24} />,
    label: "Settings",
  },
];

const ActivityBar = ({ activeView, onViewChange }: ActivityBarProps) => {
  return (
    <div
      className="flex flex-col items-center justify-between w-[48px] h-full select-none"
      style={{ background: "hsl(var(--vscode-activitybar))" }}
    >
      {/* Top Icons */}
      <div className="flex flex-col items-center w-full">
        {topItems.map((item) => (
          <button
            key={item.id}
            className={`relative w-full h-[48px] flex items-center justify-center transition-colors group ${
              activeView === item.id
                ? "text-white"
                : "text-[hsl(0,0%,45%)] hover:text-[hsl(0,0%,75%)]"
            }`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            {/* Active indicator */}
            {activeView === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />
            )}
            {item.icon}
            {/* Badge */}
            {item.badge && (
              <span className="absolute top-[8px] right-[8px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-[hsl(207,90%,54%)] text-white text-[9px] font-bold px-1">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center w-full">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className={`w-full h-[48px] flex items-center justify-center transition-colors ${
              activeView === item.id
                ? "text-white"
                : "text-[hsl(0,0%,45%)] hover:text-[hsl(0,0%,75%)]"
            }`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityBar;
