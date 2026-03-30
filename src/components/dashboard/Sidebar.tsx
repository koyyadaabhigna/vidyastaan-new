"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Calendar, Wrench, BookOpen, Bot, Award, Settings, 
  Menu, X, LogOut, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const studentNav = [
  { name: "Home", href: "/dashboard/student", icon: Home },
  { name: "My Sessions", href: "/dashboard/student/sessions", icon: Calendar },
  { name: "Workshops", href: "/dashboard/student/workshops", icon: Wrench },
  { name: "Resources", href: "/dashboard/student/resources", icon: BookOpen },
  { name: "AI Study Buddy", href: "/dashboard/student/ai-buddy", icon: Bot },
  { name: "My Portfolio", href: "/dashboard/student/portfolio", icon: Award },
];

const volunteerNav = [
  { name: "Home", href: "/dashboard/volunteer", icon: Home },
  { name: "My Students", href: "/dashboard/volunteer/students", icon: Home }, // Placeholder icon
  { name: "My Sessions", href: "/dashboard/volunteer/sessions", icon: Calendar },
  { name: "Workshops", href: "/dashboard/volunteer/workshops", icon: Wrench },
  { name: "AI Tools", href: "/dashboard/volunteer/ai-tools", icon: Bot },
  { name: "My Impact", href: "/dashboard/volunteer/impact", icon: Award },
];

const adminNav = [
  { name: "Overview", href: "/dashboard/admin", icon: Home },
  { name: "Students", href: "/dashboard/admin/students", icon: Home },
  { name: "Volunteers", href: "/dashboard/admin/volunteers", icon: Home },
  { name: "Assignments", href: "/dashboard/admin/assignments", icon: Home },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: Home },
];

export default function Sidebar({ role }: { role: "student" | "volunteer" | "admin" }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = role === "student" ? studentNav : role === "volunteer" ? volunteerNav : adminNav;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-2xl"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
              Vidyastaan
            </Link>
          </div>

          {/* User Profile Summary */}
          <div className="px-6 mb-8">
             <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                   {user?.name?.[0] || "U"}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold truncate">{user?.name}</p>
                   <p className="text-xs text-primary font-medium capitalize">{role} Portal</p>
                </div>
             </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-foreground/60 hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-foreground/40 group-hover:text-primary")} />
                  {item.name}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer Controls */}
          <div className="p-4 border-t border-border space-y-1">
             <Link
                href={`/dashboard/${role}/settings`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-foreground/60 hover:bg-primary/5 hover:text-primary transition-all"
             >
                <Settings className="w-5 h-5 opacity-40" />
                Settings
             </Link>
             <button
                onClick={() => {
                   logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-danger hover:bg-danger/5 transition-all"
             >
                <LogOut className="w-5 h-5 opacity-40" />
                Logout
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}
