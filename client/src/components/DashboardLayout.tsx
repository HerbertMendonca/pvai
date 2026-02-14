import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { LayoutDashboard, LogOut, PanelLeft, Settings, MessageCircle, AlertTriangle, Activity, Building2, Users, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { AgentSelectorModal, Agent } from "./AgentSelectorModal";
import { AgentChatModal } from "./AgentChatModal";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: MessageCircle, label: "WhatsApp", path: "/whatsapp" },
  { icon: Calendar, label: "Agendas", path: "/agendas" },
  { 
    icon: Building2, 
    label: "Setores", 
    path: "/setores",
    submenu: [
      { label: "Cadastro", path: "/setores/cadastro" },
      { label: "Cobran\u00e7a", path: "/setores/cobranca" },
      { label: "Eventos", path: "/setores/eventos" },
      { label: "Comercial", path: "/setores/comercial" },
      { label: "Rastreamento", path: "/setores/rastreamento" },
      { label: "Marketing", path: "/setores/marketing" },
      { label: "Relacionamento", path: "/setores/relacionamento" },
    ]
  },
  { icon: Users, label: "Equipe IA", path: "/equipe-ia" },
  { icon: AlertTriangle, label: "Alertas", path: "/alerts" },
  { icon: Activity, label: "Observabilidade", path: "/observability" },
  { icon: Settings, label: "Configura\u00e7\u00f5es", path: "/configuration" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Sign in to continue
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Access to this dashboard requires authentication. Continue to launch the login flow.
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const [agentSelectorOpen, setAgentSelectorOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [agentChatOpen, setAgentChatOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label="Toggle navigation"
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed ? (
                <div className="flex items-center gap-2 min-w-0 px-2">
                  <img src="https://s3.nex1brasil.com/whatsapp/pvai.png" alt="PV.ai" className="h-10 object-contain" />
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map(item => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isActive = location === item.path || (hasSubmenu && item.submenu.some((sub: any) => location === sub.path));
                const isSubmenuActive = hasSubmenu && item.submenu.some((sub: any) => location === sub.path);
                const isOpen = openSubmenus[item.path] || isSubmenuActive;

                if (!hasSubmenu) {
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setLocation(item.path)}
                        tooltip={item.label}
                        className={`h-10 transition-all font-normal`}
                      >
                        <item.icon
                          className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                        />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <div key={item.path}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={isSubmenuActive}
                        onClick={() => setOpenSubmenus(prev => ({ ...prev, [item.path]: !prev[item.path] }))}
                        tooltip={item.label}
                        className={`h-10 transition-all font-normal`}
                      >
                        <item.icon
                          className={`h-4 w-4 ${isSubmenuActive ? "text-primary" : ""}`}
                        />
                        <span>{item.label}</span>
                        {!isCollapsed && (
                          isOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {isOpen && !isCollapsed && (
                      <div className="ml-6 mt-1 mb-2 space-y-1">
                        {item.submenu.map((subItem: any) => {
                          const isSubActive = location === subItem.path;
                          return (
                            <button
                              key={subItem.path}
                              onClick={() => setLocation(subItem.path)}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                isSubActive
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-muted-foreground hover:bg-accent/50"
                              }`}
                            >
                              {subItem.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3 space-y-2">
            <Button
              onClick={() => setAgentSelectorOpen(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all"
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>Falar com a Equipe IA</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
          <AgentSelectorModal
            open={agentSelectorOpen}
            onOpenChange={setAgentSelectorOpen}
            onSelectAgent={(agent) => {
              setSelectedAgent(agent);
              setAgentChatOpen(true);
            }}
          />
          <AgentChatModal
            open={agentChatOpen}
            onOpenChange={setAgentChatOpen}
            agent={selectedAgent}
            onBackClick={() => {
              setAgentChatOpen(false);
              setAgentSelectorOpen(true);
            }}
          />
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuItem?.label ?? "Menu"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </>
  );
}
