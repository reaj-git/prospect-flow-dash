import { BarChart3, Users, Plus, LogOut, Building2 } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { title: 'Dashboard', url: '/dashboard', icon: BarChart3 },
  { title: 'Prospects', url: '/prospects', icon: Users },
  { title: 'Add Prospect', url: '/add-prospect', icon: Plus },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary' : 'hover:bg-muted/50';

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Sidebar
      className={collapsed ? 'w-14' : 'w-64'}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sm text-foreground">Prospect Flow</h2>
              <p className="text-xs text-muted-foreground">CRM Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>

      {/* Sidebar trigger for collapsed state */}
      {collapsed && (
        <div className="absolute top-4 -right-3">
          <SidebarTrigger className="bg-background border shadow-sm" />
        </div>
      )}
    </Sidebar>
  );
}