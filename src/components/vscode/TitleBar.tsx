import { useState } from "react";
import {
  Minus,
  Square,
  X,
  ChevronDown,
} from "lucide-react";

interface MenuItem {
  label: string;
  items: { label: string; shortcut?: string; divider?: boolean }[];
}

const menus: MenuItem[] = [
  {
    label: "File",
    items: [
      { label: "New Dashboard", shortcut: "Ctrl+N" },
      { label: "Open Project...", shortcut: "Ctrl+O" },
      { divider: true, label: "" },
      { label: "Save Configuration", shortcut: "Ctrl+S" },
      { label: "Export Data...", shortcut: "Ctrl+Shift+S" },
      { divider: true, label: "" },
      { label: "Preferences", shortcut: "Ctrl+," },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Command Palette...", shortcut: "Ctrl+Shift+P" },
      { divider: true, label: "" },
      { label: "Explorer", shortcut: "Ctrl+Shift+E" },
      { label: "Search", shortcut: "Ctrl+Shift+F" },
      { label: "IoT Sensors", shortcut: "Ctrl+Shift+I" },
      { label: "GPS Tracking", shortcut: "Ctrl+Shift+G" },
      { divider: true, label: "" },
      { label: "Terminal", shortcut: "Ctrl+`" },
      { label: "Output Panel", shortcut: "Ctrl+Shift+U" },
    ],
  },
  {
    label: "Dashboard",
    items: [
      { label: "Overview", shortcut: "Ctrl+1" },
      { label: "IoT Sensors", shortcut: "Ctrl+2" },
      { label: "Geoinformation", shortcut: "Ctrl+3" },
      { label: "Alerts Center", shortcut: "Ctrl+4" },
      { label: "GPS Tracking", shortcut: "Ctrl+5" },
      { divider: true, label: "" },
      { label: "Refresh All", shortcut: "F5" },
    ],
  },
  {
    label: "Terminal",
    items: [
      { label: "New Terminal", shortcut: "Ctrl+Shift+`" },
      { label: "Run Task...", shortcut: "Ctrl+Shift+B" },
      { divider: true, label: "" },
      { label: "System Logs" },
      { label: "Sensor Output" },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Welcome" },
      { label: "Documentation" },
      { label: "API Reference" },
      { divider: true, label: "" },
      { label: "About Segura-Link" },
    ],
  },
];

const TitleBar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div
      className="flex items-center h-[30px] select-none shrink-0"
      style={{ background: "hsl(var(--vscode-titlebar))" }}
    >
      {/* App Icon — sempre visível */}
      <div className="flex items-center px-2 gap-1.5 shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" className="text-[#0098ff]">
          <path
            fill="currentColor"
            d="M14.54 1.47L8.01 7.99l6.53 6.53a.5.5 0 00.46-.5V1.97a.5.5 0 00-.46-.5zM7.3 8l-5.83 5.83a.5.5 0 00.5.17l6.04-2.56L7.3 8zm.71-.71L11.45 3.86 5.97 1.47a.5.5 0 00-.5.17L7.3 7.29h.71zM1 2.17v11.66l5.29-5.29L1.71 3.96A.5.5 0 001 2.17z"
          />
        </svg>
        {/* Nome da app visível só no mobile (onde nao há titulo centrado com espaço) */}
        <span className="md:hidden text-[11px] font-semibold text-[hsl(0,0%,80%)]">
          Segura-Link
        </span>
      </div>

      {/* Menu Items — apenas tablet+ */}
      <div className="hidden md:flex items-center h-full">
        {menus.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              className={`px-2.5 h-[30px] text-[12px] transition-colors ${
                activeMenu === menu.label
                  ? "bg-[hsl(220,13%,26%)] text-white"
                  : "text-[hsl(0,0%,70%)] hover:bg-[hsl(220,13%,22%)]"
              }`}
              onClick={() =>
                setActiveMenu(activeMenu === menu.label ? null : menu.label)
              }
              onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
            >
              {menu.label}
            </button>
            {activeMenu === menu.label && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveMenu(null)}
                />
                <div
                  className="absolute top-[30px] left-0 z-50 min-w-[240px] py-1 shadow-xl border border-[hsl(220,13%,26%)]"
                  style={{ background: "hsl(220, 13%, 16%)" }}
                >
                  {menu.items.map((item, idx) =>
                    item.divider ? (
                      <div
                        key={idx}
                        className="h-px my-1 mx-2 bg-[hsl(220,13%,26%)]"
                      />
                    ) : (
                      <button
                        key={idx}
                        className="w-full flex items-center justify-between px-6 py-1 text-[12px] text-[hsl(0,0%,80%)] hover:bg-[hsl(207,90%,54%)] hover:text-white transition-colors"
                        onClick={() => setActiveMenu(null)}
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[hsl(0,0%,50%)] ml-8 text-[11px]">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Title (center) — apenas tablet+ */}
      <div className="hidden md:flex flex-1 text-center text-[12px] text-[hsl(0,0%,55%)] justify-center">
        Segura-Link - Monitoramento Inteligente
      </div>

      {/* Spacer no mobile para empurrar controlos para a direita */}
      <div className="flex-1 md:hidden" />

      {/* Window Controls — apenas tablet+ */}
      <div className="hidden md:flex items-center h-full">
        <button className="h-[30px] w-[46px] flex items-center justify-center hover:bg-[hsl(220,13%,22%)] text-[hsl(0,0%,70%)] transition-colors">
          <Minus size={14} />
        </button>
        <button className="h-[30px] w-[46px] flex items-center justify-center hover:bg-[hsl(220,13%,22%)] text-[hsl(0,0%,70%)] transition-colors">
          <Square size={11} />
        </button>
        <button className="h-[30px] w-[46px] flex items-center justify-center hover:bg-[hsl(0,72%,51%)] text-[hsl(0,0%,70%)] transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
