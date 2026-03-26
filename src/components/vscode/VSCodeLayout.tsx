import { useState } from "react";
import TitleBar from "./TitleBar";
import ActivityBar from "./ActivityBar";
import Sidebar from "./Sidebar";
import EditorTabs from "./EditorTabs";
import Breadcrumb from "./Breadcrumb";
import StatusBar from "./StatusBar";
import Panel from "./Panel";
import MobileBottomNav from "./MobileBottomNav";

interface VSCodeLayoutProps {
  children: React.ReactNode;
}

const VSCodeLayout = ({ children }: VSCodeLayoutProps) => {
  const [activeView, setActiveView] = useState("explorer");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(false); // desligado por default no tablet
  const [sidebarWidth] = useState(260);

  const handleViewChange = (view: string) => {
    if (view === activeView) {
      setSidebarVisible(!sidebarVisible);
    } else {
      setActiveView(view);
      setSidebarVisible(true);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* ── Title Bar ── */}
      <TitleBar />

      {/* ── Área principal ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ActivityBar lateral — apenas tablet+ (md+) */}
        <div className="hidden md:flex">
          <ActivityBar activeView={activeView} onViewChange={handleViewChange} />
        </div>

        {/* Sidebar — apenas desktop (lg+) */}
        {sidebarVisible && (
          <div
            className="hidden lg:flex h-full shrink-0 border-r border-[hsl(220,13%,22%)] flex-col"
            style={{ width: `${sidebarWidth}px` }}
          >
            <Sidebar activeView={activeView} />
          </div>
        )}

        {/* Área do Editor + Conteúdo */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">

          {/* Editor Tabs — apenas tablet+ */}
          <div className="hidden md:block shrink-0">
            <EditorTabs />
          </div>

          {/* Breadcrumb — apenas desktop */}
          <div className="hidden lg:block shrink-0">
            <Breadcrumb />
          </div>

          {/* Conteúdo principal — scrollável */}
          {/* pb-0 no desktop, pb-0 no tablet, no mobile o bottom nav tem 56px */}
          <div
            className="flex-1 overflow-auto pb-[56px] md:pb-0"
            style={{ background: "hsl(var(--vscode-editor))" }}
          >
            {children}
          </div>

          {/* Panel (Terminal) — apenas desktop */}
          {panelVisible && (
            <div className="hidden lg:block h-[180px] shrink-0">
              <Panel />
            </div>
          )}
        </div>
      </div>

      {/* ── Status Bar — apenas tablet+ ── */}
      <div className="hidden md:block shrink-0">
        <StatusBar />
      </div>

      {/* ── Bottom Nav — apenas mobile ── */}
      <div className="md:hidden shrink-0">
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default VSCodeLayout;
