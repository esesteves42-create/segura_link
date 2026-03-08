import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Maximize2, Minus } from "lucide-react";

const Panel = () => {
  const [activeTab, setActiveTab] = useState("terminal");
  const [logs, setLogs] = useState<string[]>([
    "\x1b[32m$ segura-link monitor --start\x1b[0m",
    "[INFO] Initializing Segura-Link monitoring system...",
    "[INFO] Connecting to LoRaWAN gateway GTW-001...",
    "[OK] Gateway GTW-001 connected (915 MHz, SF7 BW125)",
    "[INFO] Loading sensor configurations...",
    "[OK] 5/6 sensors online",
    "[WARN] SEN-006 (Luz F) - Battery critical: 12%",
    "[INFO] GPS tracking module initialized",
    "[INFO] Real-time data streaming active",
    "[OK] Dashboard ready at http://localhost:5173",
    "",
    "segura-link@1.0.0 ~/segura-link $",
  ]);

  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        `[${new Date().toLocaleTimeString("pt-BR")}] SEN-001: temp=${(20 + Math.random() * 15).toFixed(1)}°C`,
        `[${new Date().toLocaleTimeString("pt-BR")}] SEN-002: humidity=${(50 + Math.random() * 40).toFixed(1)}%`,
        `[${new Date().toLocaleTimeString("pt-BR")}] GPS: lat=${(-8.83 + Math.random() * 0.01).toFixed(4)}, lng=${(13.23 + Math.random() * 0.01).toFixed(4)}`,
      ];
      const pick = newLogs[Math.floor(Math.random() * newLogs.length)];
      setLogs(prev => [...prev.slice(-50), pick]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const tabs = [
    { id: "terminal", label: "TERMINAL" },
    { id: "output", label: "OUTPUT" },
    { id: "problems", label: "PROBLEMS", badge: 2 },
    { id: "debug", label: "DEBUG CONSOLE" },
  ];

  const formatLine = (line: string) => {
    if (line.startsWith("[OK]")) return <span className="text-green-400">{line}</span>;
    if (line.startsWith("[WARN]")) return <span className="text-yellow-400">{line}</span>;
    if (line.startsWith("[ERROR]")) return <span className="text-red-400">{line}</span>;
    if (line.startsWith("[INFO]")) return <span className="text-blue-400">{line}</span>;
    if (line.includes("$")) return <span className="text-green-300">{line}</span>;
    return <span className="text-[hsl(0,0%,70%)]">{line}</span>;
  };

  return (
    <div
      className="flex flex-col h-full border-t border-[hsl(220,13%,22%)]"
      style={{ background: "hsl(var(--vscode-panel))" }}
    >
      {/* Panel tabs */}
      <div className="flex items-center justify-between h-[35px] border-b border-[hsl(220,13%,22%)]">
        <div className="flex items-center h-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`h-full px-3 text-[11px] font-medium tracking-wider uppercase transition-colors border-b-[1px] ${
                activeTab === tab.id
                  ? "text-white border-white"
                  : "text-[hsl(0,0%,50%)] border-transparent hover:text-[hsl(0,0%,70%)]"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.badge && (
                <span className="ml-1.5 px-1 min-w-[16px] h-[16px] inline-flex items-center justify-center rounded-full bg-[hsl(207,90%,54%)] text-white text-[9px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 pr-2">
          <button className="p-1 hover:bg-[hsl(220,13%,26%)] rounded-sm text-[hsl(0,0%,55%)]">
            <Minus size={14} />
          </button>
          <button className="p-1 hover:bg-[hsl(220,13%,26%)] rounded-sm text-[hsl(0,0%,55%)]">
            <Maximize2 size={14} />
          </button>
          <button className="p-1 hover:bg-[hsl(220,13%,26%)] rounded-sm text-[hsl(0,0%,55%)]">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal content */}
      <div
        ref={logsRef}
        className="flex-1 overflow-y-auto px-4 py-2 font-mono text-[12px] leading-[18px]"
      >
        {logs.map((line, idx) => (
          <div key={idx}>{formatLine(line)}</div>
        ))}
        <div className="flex items-center text-green-300 mt-1">
          <span>segura-link@1.0.0 ~/segura-link $</span>
          <span className="w-[7px] h-[14px] bg-[hsl(0,0%,70%)] ml-0.5 vscode-cursor" />
        </div>
      </div>
    </div>
  );
};

export default Panel;
