"use client";

import {
  Calendar,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
  Search,
  Settings,
  UserRoundPen,
  UsersRound,
} from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
export const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Laporan",
    url: "/laporan",
    icon: FileText,
  },
  {
    title: "Ketua Tim",
    url: "/ketua-tim",
    icon: UsersRound,
  },
  {
    title: "Identitas",
    url: "/identitas",
    icon: UserRoundPen,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={[
                      "flex w-full items-center gap-2 overflow-hidden rounded-lg px-4 py-3 transition-colors text-foreground/60 text-base font-medium",
                      pathname === item.url
                        ? "bg-primary/10 text-foreground"
                        : "",
                      "hover:bg-muted",
                    ].join(" ")}
                  >
                    <Link href={item.url}>
                      <item.icon size={22} className="shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
