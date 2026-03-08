import { useState } from "react";
import TitleBar from "./TitleBar";
import ActivityBar from "./ActivityBar";
import Sidebar from "./Sidebar";
import EditorTabs from "./EditorTabs";
import Breadcrumb from "./Breadcrumb";
import StatusBar from "./StatusBar";
import Panel from "./Panel";

interface VSCodeLayoutProps {
  children: React.ReactNode;
}

const VSCodeLayout = ({ children }: VSCodeLayoutProps) => {
  const [activeView, setActiveView] = useState("explorer");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
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
      {/* Title Bar */}
      <TitleBar />

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <ActivityBar activeView={activeView} onViewChange={handleViewChange} />

        {/* Sidebar */}
        {sidebarVisible && (
          <div
            className="h-full shrink-0 border-r border-[hsl(220,13%,22%)]"
            style={{ width: `${sidebarWidth}px` }}
          >
            <Sidebar activeView={activeView} />
          </div>
        )}

        {/* Editor + Panel area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Editor Tabs */}
          <EditorTabs />

          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Editor Content */}
          <div className="flex-1 overflow-auto" style={{ background: "hsl(var(--vscode-editor))" }}>
            {children}
          </div>

          {/* Bottom Panel (Terminal) */}
          {panelVisible && (
            <div className="h-[180px] shrink-0">
              <Panel />
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default VSCodeLayout;
