"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Users,
    Calendar,
    Activity,
    LayoutDashboard,
    LogOut,
    Stethoscope,
    ClipboardList,
    BarChart3,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const sidebarLinks = [
    { title: "Panel Principal", href: "/dashboard", icon: LayoutDashboard },
    { title: "Pacientes", href: "/dashboard/pacientes", icon: Users },
    { title: "Citas", href: "/dashboard/citas", icon: Calendar },
    { title: "Consultas", href: "/dashboard/consultas", icon: Stethoscope, hidden: true },
    { title: "Reportes", href: "/dashboard/reportes", icon: BarChart3 },
    { title: "Auditoría", href: "/dashboard/auditoria", icon: ClipboardList },
];

export function AppSidebar({ user }: { user?: { name?: string | null; email?: string | null } }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const SidebarContent = () => (
        <div className="flex h-full flex-col justify-between py-6">
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
                        <Activity className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="block text-lg font-bold leading-none text-slate-800 dark:text-slate-100">
                            Dra. Kristhy
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                            Ginecología
                        </span>
                    </div>
                </div>

                <nav className="space-y-1.5 px-3">
                    {sidebarLinks.filter(l => !l.hidden).map((link) => {
                        const isActive = link.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(link.href);
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-slate-600 hover:bg-white/60 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800/60"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-primary")} />
                                {link.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="space-y-4 px-3">
                <SignOutButtonFull />

                <div className="flex items-center gap-3 rounded-xl border border-white/40 bg-white/50 p-3 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary font-bold">
                        {user?.name?.[0] || "D"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {user?.name || "Doctora"}
                        </p>
                        <p className="truncate text-[10px] text-slate-500">
                            {user?.email || "doctora@kristhy.com"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-72 border-r border-white/20 bg-white/50 backdrop-blur-xl transition-all dark:bg-slate-900/50 lg:fixed lg:bottom-0 lg:left-0 lg:top-0 lg:flex lg:flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Header / Trigger */}
            <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/20 bg-white/80 px-6 backdrop-blur-md dark:bg-slate-900/80 lg:hidden">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                        <Activity className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">Dra. Kristhy</span>
                </div>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6 text-slate-700" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 border-r-0 bg-white/95 backdrop-blur-xl">
                        <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}

function SignOutButtonFull() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            router.push("/login"); // or router.push("/login")
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <Button
            variant="outline"
            className="w-full justify-start gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200"
            onClick={handleSignOut}
        >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
        </Button>
    )
}
