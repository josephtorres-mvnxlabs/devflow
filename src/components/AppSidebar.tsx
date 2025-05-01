
import * as React from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Bell, BarChart, Plus, Home, Book, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export function AppLogo() {
  return (
    <div className="flex items-center space-x-2 px-2">
      <div className="w-8 h-8 rounded-md bg-devops-purple flex items-center justify-center">
        <span className="text-white font-semibold text-lg">D</span>
      </div>
      <span className="font-semibold text-lg text-sidebar-foreground">DevFlow</span>
    </div>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    return currentPath === path;
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <Button className="w-full justify-start gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground">
                <Plus className="h-4 w-4" />
                <span>New Request</span>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={cn(
                    "w-full justify-start", 
                    isActive('/') ? "text-sidebar-primary" : ""
                  )}
                  asChild
                >
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={cn(
                    "w-full justify-start", 
                    isActive('/epics-and-tasks') ? "text-sidebar-primary" : ""
                  )}
                  asChild
                >
                  <Link to="/epics-and-tasks">
                    <Book className="w-4 h-4 mr-2" />
                    <span>Epics & Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={cn(
                    "w-full justify-start", 
                    isActive('/reports') ? "text-sidebar-primary" : ""
                  )}
                  asChild
                >
                  <Link to="/reports">
                    <BarChart className="w-4 h-4 mr-2" />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={cn(
                    "w-full justify-start", 
                    isActive('/team') ? "text-sidebar-primary" : ""
                  )}
                  asChild
                >
                  <Link to="/team">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={cn(
                    "w-full justify-start", 
                    isActive('/settings') ? "text-sidebar-primary" : ""
                  )}
                  asChild
                >
                  <Link to="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4">
        <div className="px-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="rounded-full bg-devops-purple-dark h-9 w-9 flex items-center justify-center">
              <span className="text-white font-medium">JS</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium leading-none text-sidebar-foreground">John Smith</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">john.smith@company.com</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
