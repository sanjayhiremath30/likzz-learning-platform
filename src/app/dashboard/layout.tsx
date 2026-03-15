"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
    BookOpen,
    LayoutDashboard,
    Settings,
    Award,
    LogOut,
    BrainCircuit,
    Bell
} from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const { cartCount } = useCart();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    if (!session) return null;

    const sidebarLinks = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
        { name: "Certificates", href: "/dashboard/certificates", icon: Award },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[var(--muted)]/30 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <BrainCircuit size={18} />
                        </div>
                        <span className="font-bold tracking-tight">LIKZZ</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                )}
                            >
                                <link.icon size={18} />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-600 text-white flex items-center justify-center font-bold">
                            {session.user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{session.user?.name}</p>
                            <p className="text-xs text-[var(--muted-foreground)] whitespace-nowrap overflow-hidden text-ellipsis">{session.user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--muted)] transition-colors text-red-600 dark:text-red-400"
                    >
                        <LogOut size={16} /> Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-10">
                    <h2 className="font-semibold text-lg hidden sm:block">
                        {sidebarLinks.find(l => l.href === pathname)?.name || "Dashboard"}
                    </h2>
                    <div className="flex items-center gap-4 ml-auto">
                        <Link href="/checkout" className="p-2 rounded-full hover:bg-[var(--muted)] relative text-[var(--muted-foreground)]">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button className="p-2 rounded-full hover:bg-[var(--muted)] relative text-[var(--muted-foreground)]">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <div className="p-6 md:p-8 flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
