import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, Train } from "lucide-react";
import { MENU, type MenuItem } from "./menu";
import { useAppSelector } from "@/app/hooks";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function Sidebar() {
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const isPathActive = (path?: string) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (isPathActive(item.to)) return true;
    return item.children?.some(isItemActive) ?? false;
  };

  const filteredMenu = MENU.filter(
    (item) => !item.roles || item.roles.includes(user?.role || "operator"),
  );

  return (
    <UiSidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground">
        <div className="flex h-10 items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-600 to-amber-600 text-white">
            <Train className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-semibold">Saad Cargo</div>
            <div className="text-xs text-sidebar-primary-foreground/70">
              Railway ERP
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {filteredMenu.map((section) => {
          const children = section.children ?? [];
          const hasChildren = children.length > 0;
          const sectionIsActive = isItemActive(section);

          if (hasChildren) {
            const isOpen = openSections[section.label] ?? sectionIsActive;

            return (
              <Collapsible
                key={section.label}
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenSections((prev) => ({
                    ...prev,
                    [section.label]: open,
                  }))
                }
                className="group/collapsible"
              >
                <SidebarGroup>
                  <SidebarGroupLabel className="p-0">
                    <CollapsibleTrigger className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      {section.icon ? (
                        <section.icon className="h-4 w-4" />
                      ) : null}
                      <span>{section.label}</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>

                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {children.map((item) => (
                          <SidebarMenuItem key={item.label}>
                            {item.children?.length ? (
                              <Collapsible
                                open={
                                  openSubmenus[item.label] ?? isItemActive(item)
                                }
                                onOpenChange={(open) =>
                                  setOpenSubmenus((prev) => ({
                                    ...prev,
                                    [item.label]: open,
                                  }))
                                }
                                className="group/submenu"
                              >
                                <CollapsibleTrigger className="w-full">
                                  <SidebarMenuButton
                                    isActive={isItemActive(item)}
                                    tooltip={item.label}
                                    render={<div />}
                                  >
                                    {item.icon ? (
                                      <item.icon className="h-4 w-4" />
                                    ) : null}
                                    <span>{item.label}</span>
                                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/submenu:rotate-90" />
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <SidebarMenuSub>
                                    {item.children
                                      .filter((child) => child.to)
                                      .map((child) => (
                                        <SidebarMenuSubItem
                                          key={`${item.label}-${child.label}`}
                                        >
                                          <SidebarMenuSubButton
                                            render={
                                              <NavLink to={child.to!} end />
                                            }
                                            isActive={isPathActive(child.to)}
                                          >
                                            <span>{child.label}</span>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </Collapsible>
                            ) : item.to ? (
                              <SidebarMenuButton
                                render={<NavLink to={item.to} end />}
                                isActive={isPathActive(item.to)}
                                tooltip={item.label}
                              >
                                {item.icon ? (
                                  <item.icon className="h-4 w-4" />
                                ) : null}
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            ) : null}
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            );
          }

          return section.to ? (
            <SidebarGroup key={section.label}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<NavLink to={section.to} end />}
                      isActive={sectionIsActive}
                      tooltip={section.label}
                    >
                      {section.icon ? (
                        <section.icon className="h-4 w-4" />
                      ) : null}
                      <span>{section.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null;
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-2 py-3">
        <div className="text-sm font-medium text-sidebar-foreground">
          {user?.name || "User"}
        </div>
        <div className="text-xs capitalize text-sidebar-foreground/70">
          {user?.role}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </UiSidebar>
  );
}
