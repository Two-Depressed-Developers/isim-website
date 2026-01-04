"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCircle,
  Settings,
  LogOut,
  ChevronsUpDown,
  ChevronLeft,
  Calendar,
  Ticket,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, usePathname } from "@/i18n/navigation";

export function PanelSidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const roles = session?.user?.roles ?? [];
  const isAdmin = roles.includes("PanelAdmin");
  const isStaffMember = roles.includes("StaffMember");
  const isHelpdeskMember = roles.includes("Helpdesk");

  type MenuGroup = {
    label: string;
    items: { href: string; label: string; icon: typeof UserCircle }[];
  };
  const staffMemberGroup: MenuGroup[] = [
    {
      label: "Mój profil",
      items: [
        { href: "/panel/profile", label: "Profil", icon: UserCircle },
        { href: "/panel/consultations", label: "Konsultacje", icon: Users },
        { href: "/panel/calendar", label: "Kalendarz", icon: Calendar },
        {
          href: "/panel/scrape-request",
          label: "Wyszukiwanie danych",
          icon: UserCircle,
        },
      ],
    },
  ];

  const helpdeskMenuGroup: MenuGroup[] = [
    {
      label: "Helpdesk",
      items: [{ href: "/panel/tickets", label: "Zgłoszenia", icon: Ticket }],
    },
  ];

  const adminMenuGroup: MenuGroup[] = [
    {
      label: "Administracja",
      items: [{ href: "/panel/users", label: "Użytkownicy", icon: Users }],
    },
  ];

  const menuGroups: MenuGroup[] = isAdmin
    ? [...adminMenuGroup, ...staffMemberGroup, ...helpdeskMenuGroup]
    : [
        ...(isStaffMember ? staffMemberGroup : []),
        ...(isHelpdeskMember ? helpdeskMenuGroup : []),
      ];

  const footerLinks = [
    { href: "/panel/settings", label: "Ustawienia", icon: Settings },
  ];

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="sticky top-0 left-0 h-screen min-w-64 border-r shadow-sm"
    >
      <SidebarHeader className="border-b py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="sm"
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground text-sm"
            >
              <Link href="/">
                <ChevronLeft />
                <span>Powrót do strony głównej</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="min-w-64 py-2">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu className="px-1">
              {group.items.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === href || pathname?.startsWith(`${href}/`)
                    }
                    className="h-10"
                  >
                    <Link href={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t px-4 py-3">
        <SidebarMenu className="gap-y-3">
          {footerLinks.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === href}
                className="h-10 px-3"
              >
                <Link href={href}>
                  <Icon />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={status === "loading"}>
                <SidebarMenuButton
                  size="lg"
                  className="w-full items-center gap-3 rounded-xl border text-left transition-colors"
                >
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    {status === "loading" ? (
                      <>
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="mt-1 h-3 w-40" />
                      </>
                    ) : (
                      <>
                        <span className="truncate font-medium">
                          {session?.user?.username ??
                            session?.user?.email?.split("@")[0]}
                        </span>
                        <span className="truncate text-xs opacity-70">
                          {session?.user?.email}
                        </span>
                      </>
                    )}
                  </div>
                  <ChevronsUpDown />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="right"
                className="w-64 rounded-xl border p-2 shadow-lg"
              >
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg font-medium"
                >
                  <LogOut />
                  Wyloguj się
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
