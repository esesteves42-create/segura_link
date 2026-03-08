import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  Wifi,
  WifiOff,
  Globe,
  Bell,
  Navigation,
  Thermometer,
  Droplets,
  Eye,
  Zap,
  MapPin,
  AlertTriangle,
  Shield,
  Radio,
  Satellite,
  Search,
  MoreHorizontal,
  RefreshCw,
  FolderPlus,
  FilePlus,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  activeView: string;
}

interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  route?: string;
  iconColor?: string;
}

const explorerTree: TreeNode[] = [
  {
    id: "project",
    label: "SEGURA-LINK",
    children: [
      {
        id: "dashboards",
        label: "dashboards",
        icon: <Folder size={16} />,
        children: [
          {
            id: "overview",
            label: "overview.tsx",
            icon: <FileText size={16} />,
            route: "/dashboard",
            iconColor: "text-[#519aba]",
          },
          {
            id: "iot",
            label: "iot-sensors.tsx",
            icon: <FileText size={16} />,
            route: "/dashboard/iot",
            iconColor: "text-[#519aba]",
          },
          {
            id: "geo",
            label: "geoinformation.tsx",
            icon: <FileText size={16} />,
            route: "/dashboard/geo",
            iconColor: "text-[#519aba]",
          },
          {
            id: "alerts",
            label: "alerts-center.tsx",
            icon: <FileText size={16} />,
            route: "/dashboard/alerts",
            iconColor: "text-[#519aba]",
          },
          {
            id: "tracking",
            label: "gps-tracking.tsx",
            icon: <FileText size={16} />,
            route: "/dashboard/tracking",
            iconColor: "text-[#519aba]",
          },
        ],
      },
      {
        id: "components",
        label: "components",
        icon: <Folder size={16} />,
        children: [
          {
            id: "sensors",
            label: "sensors",
            icon: <Folder size={16} />,
            children: [
              { id: "temp", label: "temperature.tsx", icon: <FileText size={16} />, iconColor: "text-[#519aba]" },
              { id: "humid", label: "humidity.tsx", icon: <FileText size={16} />, iconColor: "text-[#519aba]" },
              { id: "motion", label: "motion.tsx", icon: <FileText size={16} />, iconColor: "text-[#519aba]" },
            ],
          },
          {
            id: "maps",
            label: "maps",
            icon: <Folder size={16} />,
            children: [
              { id: "interactive", label: "interactive-map.tsx", icon: <FileText size={16} />, iconColor: "text-[#519aba]" },
              { id: "layers", label: "map-layers.tsx", icon: <FileText size={16} />, iconColor: "text-[#519aba]" },
            ],
          },
          {
            id: "charts",
            label: "charts",
            icon: <Folder size={16} />,
            children: [
              { id: "sensor-charts", label: "sensor-charts.tsx", icon: <FileText size={16} />, iconColor: "text-[#519aba]" },
              { id: "history", label: "history-chart.tsx", icon: <FileText size={16} />, iconColor: "text-[#519aba]" },
            ],
          },
        ],
      },
      {
        id: "config",
        label: "config",
        icon: <Folder size={16} />,
        children: [
          { id: "env", label: ".env.local", icon: <FileText size={16} />, iconColor: "text-[#e37933]" },
          { id: "tsconfig", label: "tsconfig.json", icon: <FileText size={16} />, iconColor: "text-[#cbcb41]" },
          { id: "package", label: "package.json", icon: <FileText size={16} />, iconColor: "text-[#e8274b]" },
        ],
      },
      { id: "readme", label: "README.md", icon: <FileText size={16} />, iconColor: "text-[#519aba]" },
      { id: "home", label: "index.tsx", icon: <FileText size={16} />, route: "/", iconColor: "text-[#519aba]" },
    ],
  },
];

const iotTree: TreeNode[] = [
  {
    id: "sensors",
    label: "SENSORES ATIVOS",
    children: [
      {
        id: "sen001",
        label: "SEN-001 Temperatura A",
        icon: <Thermometer size={16} />,
        iconColor: "text-green-400",
      },
      {
        id: "sen002",
        label: "SEN-002 Humidade B",
        icon: <Droplets size={16} />,
        iconColor: "text-green-400",
      },
      {
        id: "sen003",
        label: "SEN-003 Solo C",
        icon: <Zap size={16} />,
        iconColor: "text-green-400",
      },
      {
        id: "sen004",
        label: "SEN-004 Movimento D",
        icon: <Eye size={16} />,
        iconColor: "text-yellow-400",
      },
      {
        id: "sen005",
        label: "SEN-005 Pressao E",
        icon: <Radio size={16} />,
        iconColor: "text-green-400",
      },
      {
        id: "sen006",
        label: "SEN-006 Luz F",
        icon: <WifiOff size={16} />,
        iconColor: "text-red-400",
      },
    ],
  },
  {
    id: "gateways",
    label: "GATEWAYS",
    children: [
      {
        id: "gtw001",
        label: "GTW-001 Principal",
        icon: <Wifi size={16} />,
        iconColor: "text-green-400",
      },
    ],
  },
];

const geoTree: TreeNode[] = [
  {
    id: "locations",
    label: "LOCALIZACOES",
    children: [
      { id: "loc1", label: "Area Agricola Norte", icon: <MapPin size={16} />, iconColor: "text-green-400" },
      { id: "loc2", label: "Zona de Risco Sul", icon: <AlertTriangle size={16} />, iconColor: "text-yellow-400" },
      { id: "loc3", label: "Perimetro Seguranca A", icon: <Shield size={16} />, iconColor: "text-blue-400" },
      { id: "loc4", label: "Area Conservacao B", icon: <Globe size={16} />, iconColor: "text-emerald-400" },
    ],
  },
  {
    id: "satellite",
    label: "IMAGENS SATELITE",
    children: [
      { id: "sat1", label: "2025-12-01 RGB 10m", icon: <Satellite size={16} />, iconColor: "text-purple-400" },
      { id: "sat2", label: "2025-11-25 Multi 5m", icon: <Satellite size={16} />, iconColor: "text-purple-400" },
      { id: "sat3", label: "2025-11-20 IR 10m", icon: <Satellite size={16} />, iconColor: "text-purple-400" },
    ],
  },
];

const alertsTree: TreeNode[] = [
  {
    id: "critical",
    label: "CRITICOS (2)",
    children: [
      { id: "a1", label: "Movimento - Zona Restrita", icon: <AlertTriangle size={16} />, iconColor: "text-red-400" },
      { id: "a4", label: "Bateria Baixa - Sensor F", icon: <AlertTriangle size={16} />, iconColor: "text-red-400" },
    ],
  },
  {
    id: "warnings",
    label: "AVISOS (2)",
    children: [
      { id: "a2", label: "Temperatura Elevada", icon: <Bell size={16} />, iconColor: "text-yellow-400" },
      { id: "a5", label: "Conexao Intermitente", icon: <Bell size={16} />, iconColor: "text-yellow-400" },
    ],
  },
  {
    id: "info",
    label: "INFO (1)",
    children: [
      { id: "a3", label: "Manutencao Programada", icon: <Bell size={16} />, iconColor: "text-blue-400" },
    ],
  },
];

const trackingTree: TreeNode[] = [
  {
    id: "vehicles",
    label: "VEICULOS",
    children: [
      { id: "v1", label: "Toyota Hilux - ANG-001", icon: <Navigation size={16} />, iconColor: "text-green-400" },
      { id: "v2", label: "Ford Ranger - ANG-002", icon: <Navigation size={16} />, iconColor: "text-green-400" },
      { id: "v3", label: "Nissan Patrol - ANG-003", icon: <Navigation size={16} />, iconColor: "text-yellow-400" },
    ],
  },
  {
    id: "routes",
    label: "ROTAS ATIVAS",
    children: [
      { id: "r1", label: "Rota Luanda-Malanje", icon: <MapPin size={16} />, iconColor: "text-blue-400" },
      { id: "r2", label: "Rota Benguela-Huambo", icon: <MapPin size={16} />, iconColor: "text-blue-400" },
    ],
  },
];

const getTreeForView = (view: string): TreeNode[] => {
  switch (view) {
    case "iot":
      return iotTree;
    case "geo":
      return geoTree;
    case "alerts":
      return alertsTree;
    case "tracking":
      return trackingTree;
    default:
      return explorerTree;
  }
};

const getSidebarTitle = (view: string): string => {
  switch (view) {
    case "iot":
      return "IOT SENSORS";
    case "geo":
      return "GEOINFORMATION";
    case "alerts":
      return "ALERTS CENTER";
    case "tracking":
      return "GPS TRACKING";
    case "search":
      return "SEARCH";
    case "git":
      return "SOURCE CONTROL";
    case "debug":
      return "RUN AND DEBUG";
    case "extensions":
      return "EXTENSIONS";
    case "settings":
      return "SETTINGS";
    default:
      return "EXPLORER";
  }
};

const TreeItem = ({
  node,
  depth = 0,
}: {
  node: TreeNode;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = node.route === location.pathname;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
    if (node.route) {
      navigate(node.route);
    }
  };

  return (
    <div>
      <button
        className={`w-full flex items-center h-[22px] text-[13px] hover:bg-[hsl(220,13%,24%)] transition-colors ${
          isActive ? "bg-[hsl(207,90%,54%,0.2)] text-white" : "text-[hsl(0,0%,75%)]"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown size={16} className="shrink-0 mr-0.5 text-[hsl(0,0%,55%)]" />
          ) : (
            <ChevronRight size={16} className="shrink-0 mr-0.5 text-[hsl(0,0%,55%)]" />
          )
        ) : (
          <span className="w-[16px] shrink-0 mr-0.5" />
        )}
        {hasChildren && !node.icon ? (
          isOpen ? (
            <FolderOpen size={16} className="shrink-0 mr-1.5 text-[#dcb67a]" />
          ) : (
            <Folder size={16} className="shrink-0 mr-1.5 text-[#dcb67a]" />
          )
        ) : node.icon ? (
          <span className={`shrink-0 mr-1.5 ${node.iconColor || ""}`}>{node.icon}</span>
        ) : null}
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && isOpen && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ activeView }: SidebarProps) => {
  const tree = getTreeForView(activeView);
  const title = getSidebarTitle(activeView);

  if (activeView === "search") {
    return (
      <div
        className="h-full flex flex-col"
        style={{ background: "hsl(var(--vscode-sidebar))" }}
      >
        <div className="flex items-center justify-between h-[35px] px-4 text-[11px] font-semibold tracking-wider text-[hsl(0,0%,60%)] uppercase shrink-0">
          <span>{title}</span>
        </div>
        <div className="px-2 pb-2">
          <div className="flex items-center h-[26px] bg-[hsl(220,13%,14%)] border border-[hsl(220,13%,26%)] rounded-sm px-2">
            <Search size={14} className="text-[hsl(0,0%,50%)] mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Search sensors, alerts..."
              className="bg-transparent text-[13px] text-[hsl(0,0%,80%)] placeholder:text-[hsl(0,0%,40%)] w-full outline-none"
            />
          </div>
        </div>
        <div className="flex-1 px-4 text-[12px] text-[hsl(0,0%,50%)]">
          Type to search across the monitoring system
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "hsl(var(--vscode-sidebar))" }}
    >
      {/* Title */}
      <div className="flex items-center justify-between h-[35px] px-4 text-[11px] font-semibold tracking-wider text-[hsl(0,0%,60%)] uppercase shrink-0">
        <span>{title}</span>
        <div className="flex items-center gap-1">
          <button className="p-0.5 hover:bg-[hsl(220,13%,26%)] rounded-sm text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,80%)]">
            <FilePlus size={14} />
          </button>
          <button className="p-0.5 hover:bg-[hsl(220,13%,26%)] rounded-sm text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,80%)]">
            <FolderPlus size={14} />
          </button>
          <button className="p-0.5 hover:bg-[hsl(220,13%,26%)] rounded-sm text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,80%)]">
            <RefreshCw size={14} />
          </button>
          <button className="p-0.5 hover:bg-[hsl(220,13%,26%)] rounded-sm text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,80%)]">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto">
        {tree.map((node) => (
          <TreeItem key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
