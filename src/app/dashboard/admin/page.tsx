"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, Calendar, Wrench, ShieldCheck, 
  ArrowRight, TrendingUp, AlertCircle, Clock, 
  CheckCircle2, Share2, BarChart3, Search, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getGlobalStats, getUnassignedStudents } from "@/lib/db";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [globalStats, unassigned] = await Promise.all([
          getGlobalStats(),
          getUnassignedStudents()
        ]);
        setStats(globalStats);
        setUnassignedCount(unassigned.length);
      } catch (error) {
        console.error("Admin dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const GLOBAL_STATS = [
    { label: "Total Students", value: stats?.studentCount?.toLocaleString() || "0", icon: Users, color: "text-primary", bg: "bg-primary/5" },
    { label: "Active Volunteers", value: stats?.volunteerCount?.toLocaleString() || "0", icon: UserIcon, color: "text-accent", bg: "bg-accent/5" },
    { label: "Total Sessions", value: stats?.sessionCount?.toLocaleString() || "0", icon: Calendar, color: "text-warning", bg: "bg-warning/5" },
    { label: "Pending Applications", value: stats?.pendingAppCount?.toLocaleString() || "0", icon: ShieldCheck, color: "text-danger", bg: "bg-danger/5" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Overview</h1>
          <p className="text-foreground/50 mt-1 font-medium">Monitoring the pulse of Vidyastaan mentorship.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-3 bg-white border border-border rounded-xl font-bold flex items-center gap-2 hover:bg-background transition-all">
              <BarChart3 className="w-5 h-5 text-foreground/40" />
              Impact Report
           </button>
           <Link href="/dashboard/admin/volunteers" className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
              Review Pendings
              <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </header>

      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {GLOBAL_STATS.map((stat, idx) => (
          <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl transition-all duration-300">
             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
             </div>
             <p className="text-foreground/30 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-3xl font-extrabold tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Activity (Left) */}
         <div className="lg:col-span-2 space-y-8">
            <section className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                     <Clock className="w-6 h-6 text-primary" />
                     Recent Activity
                  </h2>
                  <button className="text-sm font-bold text-primary hover:underline">View All</button>
               </div>
               <div className="space-y-4">
                  {/* Mock Activity for UI demo */}
                  {[
                    { id: "1", type: "app", title: "New Volunteer Applied", name: "Rahul Sharma", time: "2 min ago" },
                    { id: "2", type: "match", title: "Match Confirmed", name: "Ananya I. matched with Sneha M.", time: "1 hour ago" },
                  ].map((activity) => (
                    <div key={activity.id} className="p-6 bg-white rounded-3xl border border-border flex items-center justify-between group hover:shadow-lg transition-all">
                       <div className="flex items-center gap-5">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                            activity.type === "app" ? "bg-danger/10 text-danger" : 
                            activity.type === "match" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                          )}>
                             {activity.type === "app" ? <ShieldCheck className="w-5 h-5" /> : 
                              activity.type === "match" ? <Users className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                          </div>
                          <div>
                             <h4 className="font-bold text-lg">{activity.title}</h4>
                             <p className="text-sm font-medium text-foreground/40">{activity.name} • {activity.time}</p>
                          </div>
                       </div>
                       <ArrowRight className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" />
                    </div>
                  ))}
               </div>
            </section>

            {/* Quick Chart Placeholder */}
            <section className="p-10 bg-white rounded-[3rem] border border-border shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary/40 mb-6">
                  <TrendingUp className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold mb-2">Sessions Trend</h3>
               <p className="text-foreground/40 font-medium max-w-sm">
                  Active sessions are up 12% compared to last week. Analytics dashboard available for deeper insights.
               </p>
            </section>
         </div>

         {/* Sidebar Alerts (Right) */}
         <div className="space-y-8">
            <section className="p-8 bg-danger/5 rounded-[2.5rem] border border-danger/10">
               <h2 className="text-xl font-bold flex items-center gap-3 text-danger-foreground mb-6">
                  <AlertCircle className="w-5 h-5 text-danger" />
                  At-Risk Students
               </h2>
               <div className="space-y-4">
                  {[
                    { id: "1", name: "Rahul K.", grade: "Grade 10", reason: "Missed 3 sessions" },
                    { id: "2", name: "Sneha M.", grade: "Grade 8", reason: "Low progress scores" },
                  ].map((s) => (
                    <div key={s.id} className="p-4 bg-white rounded-2xl border border-danger/20 flex items-center justify-between">
                       <div>
                          <p className="font-bold text-sm">{s.name}</p>
                          <p className="text-[10px] font-bold text-foreground/40 uppercase">{s.grade} • {s.reason}</p>
                       </div>
                       <button className="p-2 text-danger hover:bg-danger/5 rounded-lg">
                          <ArrowRight className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-3 bg-white text-danger font-bold rounded-xl border border-danger/20 hover:bg-danger/5 transition-all text-sm">
                  Full At-Risk Report
               </button>
            </section>

            <section className="p-8 bg-accent/5 rounded-[2.5rem] border border-accent/10">
               <h2 className="text-xl font-bold flex items-center gap-3 text-accent-foreground mb-6">
                  <Share2 className="w-5 h-5 text-accent" />
                  Unassigned Students
               </h2>
               <div className="flex flex-col items-center text-center py-6">
                  <div className="text-4xl font-extrabold text-accent mb-2">{unassignedCount}</div>
                  <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-6">Students Waiting</p>
                  <Link href="/dashboard/admin/assignments" className="w-full py-3 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all text-sm text-center">
                     Start Matching
                  </Link>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

