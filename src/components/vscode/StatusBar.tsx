import { useState, useEffect } from "react";
import {
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Info,
  Wifi,
  Bell,
  Radio,
  Zap,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const StatusBar = () => {
  const [time, setTime] = useState(new Date());
  const [sensorCount] = useState(5);
  const [alertCount] = useState(2);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Sessão terminada");
      navigate("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao terminar sessão");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-between h-[22px] px-2 select-none text-[12px] text-white"
      style={{ background: "hsl(var(--vscode-statusbar))" }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Remote indicator */}
        <button className="flex items-center gap-1 h-full px-1.5 hover:bg-white/10 transition-colors">
          <Radio size={12} />
          <span>Segura-Link</span>
        </button>

        {/* Branch */}
        <button className="flex items-center gap-1 h-full px-1 hover:bg-white/10 transition-colors">
          <GitBranch size={12} />
          <span>main</span>
        </button>

        {/* Sync */}
        <button className="flex items-center gap-1 h-full px-1 hover:bg-white/10 transition-colors">
          <Zap size={12} />
          <span>Synced</span>
        </button>

        {/* Errors/Warnings */}
        <button className="flex items-center gap-2 h-full px-1 hover:bg-white/10 transition-colors">
          <span className="flex items-center gap-0.5">
            <AlertTriangle size={12} />
            <span>{alertCount}</span>
          </span>
          <span className="flex items-center gap-0.5">
            <Info size={12} />
            <span>0</span>
          </span>
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* Sensors */}
        <button className="flex items-center gap-1 h-full px-1 hover:bg-white/10 transition-colors">
          <Wifi size={12} />
          <span className="hidden lg:inline">{sensorCount}/6 Online</span>
        </button>

        {/* Alerts */}
        <button className="flex items-center gap-1 h-full px-1 hover:bg-white/10 transition-colors">
          <Bell size={12} />
          <span className="hidden lg:inline">{alertCount} Alerts</span>
        </button>

        {/* Status */}
        <button className="hidden md:flex items-center gap-1 h-full px-1 hover:bg-white/10 transition-colors">
          <CheckCircle2 size={12} />
          <span>Sistema Ativo</span>
        </button>

        {/* User / auth */}
        {user ? (
          <>
            <button
              className="hidden md:flex items-center gap-1 h-full px-1 hover:bg-white/10 transition-colors max-w-[180px] truncate"
              title={user.email ?? ""}
            >
              <UserIcon size={12} />
              <span className="truncate">{user.email}</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 h-full px-1 hover:bg-white/10 transition-colors"
              title="Terminar sessão"
            >
              <LogOut size={12} />
              <span className="hidden lg:inline">Sair</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1 h-full px-1 hover:bg-white/10 transition-colors"
          >
            <UserIcon size={12} />
            <span className="hidden md:inline">Entrar</span>
          </button>
        )}

        {/* Time */}
        <span className="flex items-center gap-1 px-1 text-[11px]">
          {time.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {/* Encoding — apenas desktop */}
        <button className="hidden lg:flex h-full px-1 hover:bg-white/10 transition-colors">
          UTF-8
        </button>

        {/* Language — apenas desktop */}
        <button className="hidden lg:flex h-full px-1 hover:bg-white/10 transition-colors">
          TypeScript React
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
