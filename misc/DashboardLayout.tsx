"use client";

import { Logo } from "@/components/qlp/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    BadgeCheck,
    Building2,
    ChevronDown,
    Key,
    LayoutDashboard,
    LogOut,
    MapPin,
    Menu,
    ShoppingBag,
    Tag,
    Users,
    Users2,
    UserSquare2,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavChild = {
  href: string;
  label: string;
  icon: any;
};

type NavItem = {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
  children?: NavChild[];
};

const nav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin-management", label: "Admins", icon: Users2 },
  {
    href: "/dashboard/properties",
    label: "Properties",
    icon: Building2,
    children: [
      { href: "/dashboard/properties/buy", label: "Buy", icon: ShoppingBag },
      { href: "/dashboard/properties/sell", label: "Sell", icon: Tag },
      { href: "/dashboard/properties/rent", label: "Rent", icon: Key },
      { href: "/dashboard/properties/plots", label: "Plots", icon: MapPin },
      // {
      //   href: "/dashboard/properties/residential",
      //   label: "Residential",
      //   icon: HomeIcon,
      // },
    ],
  },
  { href: "/dashboard/addresses", label: "Addresses", icon: MapPin },
  { href: "/dashboard/agents", label: "Agents", icon: BadgeCheck },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/customers", label: "Customers", icon: UserSquare2 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const propertiesActive = pathname?.startsWith("/dashboard/properties");

  const [propsOpen, setPropsOpen] = useState(propertiesActive);

  useEffect(() => {
    if (propertiesActive) setPropsOpen(true);
  }, [propertiesActive]);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/"; // redirect after logout
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <div className="min-h-screen w-full p-3 md:p-5">
      {/* Mobile top bar */}
      <div className="md:hidden mb-3 flex items-center justify-between rounded-2xl bg-card/90 backdrop-blur px-4 py-3 shadow-card">
        <Logo />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed md:sticky inset-y-3 left-3 md:left-0 md:top-5 z-40 w-64 md:w-60",
            "h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2.5rem)]",
            "rounded-3xl bg-emerald text-white shadow-float",
            "flex flex-col p-4 transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-[110%] md:translate-x-0"
          )}
        >
          <div className="px-2 py-3">
            <Logo />
          </div>

          <div className="my-3 h-px bg-sidebar-border" />

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {nav.map((item) => {
              if (item.children) {
                const expanded = propsOpen || propertiesActive;

                return (
                  <div key={item.href}>
                    <button
                      onClick={() => setPropsOpen(!propsOpen)}
                      className={cn(
                        "group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        propertiesActive
                          ? "bg-gradient-gold-soft text-gradient-gold"
                          : "text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4" />

                      <span className="tracking-wide flex-1 text-left">
                        {item.label}
                      </span>

                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          expanded ? "rotate-0" : "-rotate-90"
                        )}
                      />
                    </button>

                    {expanded && (
                      <div className="mt-1 ml-3 pl-3 border-l border-sidebar-border space-y-0.5">
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                                childActive
                                  ? "bg-gradient-gold-soft text-gradient-gold shadow-gold"
                                  : "hover:bg-gradient-gold-soft hover:text-gradient-gold"
                              )}
                            >
                              <child.icon className="h-3.5 w-3.5" />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const active = isActive(item.href, item.exact);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-gradient-gold-soft text-gradient-gold shadow-gold"
                      : "text-white hover:bg-gradient-gold-soft hover:text-gradient-gold"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-3 rounded-xl bg-gradient-gold p-3">
            <div className="text-sm font-semibold text-white">Admin · QLP</div>

            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-2 text-xs text-white underline hover:underline"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div key={pathname} className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}