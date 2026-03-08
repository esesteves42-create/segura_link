import { ChevronRight, Home } from "lucide-react";
import { useLocation } from "react-router-dom";

const routeLabels: Record<string, { label: string; folder?: string }> = {
  "/": { label: "index.tsx", folder: "src" },
  "/dashboard": { label: "overview.tsx", folder: "dashboards" },
  "/dashboard/iot": { label: "iot-sensors.tsx", folder: "dashboards" },
  "/dashboard/geo": { label: "geoinformation.tsx", folder: "dashboards" },
  "/dashboard/alerts": { label: "alerts-center.tsx", folder: "dashboards" },
  "/dashboard/tracking": { label: "gps-tracking.tsx", folder: "dashboards" },
};

const Breadcrumb = () => {
  const location = useLocation();
  const current = routeLabels[location.pathname] || { label: "unknown", folder: "src" };

  return (
    <div className="flex items-center h-[22px] px-3 text-[12px] text-[hsl(0,0%,55%)] bg-[hsl(var(--vscode-editor))] border-b border-[hsl(220,13%,22%)]">
      <span className="hover:text-[hsl(0,0%,80%)] cursor-pointer">segura-link</span>
      <ChevronRight size={12} className="mx-1 text-[hsl(0,0%,40%)]" />
      <span className="hover:text-[hsl(0,0%,80%)] cursor-pointer">src</span>
      {current.folder && (
        <>
          <ChevronRight size={12} className="mx-1 text-[hsl(0,0%,40%)]" />
          <span className="hover:text-[hsl(0,0%,80%)] cursor-pointer">{current.folder}</span>
        </>
      )}
      <ChevronRight size={12} className="mx-1 text-[hsl(0,0%,40%)]" />
      <span className="text-[hsl(0,0%,80%)]">{current.label}</span>
    </div>
  );
};

export default Breadcrumb;
