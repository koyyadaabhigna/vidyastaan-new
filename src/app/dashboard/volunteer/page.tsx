"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, Calendar, Wrench, Heart, Play, 
  ArrowRight, Clock, CheckCircle2, Sparkles, Loader2, Target, BarChart3, Star, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getVolunteerProfile, getSessionsForUser, getStudentsForVolunteer } from "@/lib/db";

export default function VolunteerDashboardHome() {
  const { user } = useAuth();
  const [volunteerData, setVolunteerData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      if (!user) return;
      try {
        const [profile, assignedStudents, volunteerSessions] = await Promise.all([
          getVolunteerProfile(user.uid),
          getStudentsForVolunteer(user.uid),
          getSessionsForUser(user.uid, "volunteer")
        ]);

        setVolunteerData(profile);
        setStudents(assignedStudents);
        setSessions(volunteerSessions);
      } catch (error) {
        console.error("Volunteer dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const upcomingTasks = sessions
    .filter(s => s.status === "scheduled")
    .map(s => ({
      id: s.id,
      type: "session",
      title: `${s.subject}: ${s.topic || "Scheduled Session"}`,
      student: s.studentName,
      time: new Date(s.scheduledAt?.seconds * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
    }))
    .slice(0, 3);

  const STATS = [
    { label: "Students", value: students.length.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", glow: "shadow-indigo-500/10" },
    { label: "Sessions", value: volunteerData?.sessionCount || "0", icon: Calendar, color: "text-cyan-600", bg: "bg-cyan-50", glow: "shadow-cyan-500/10" },
    { label: "Workshops", value: volunteerData?.workshopCount || "0", icon: Wrench, color: "text-rose-600", bg: "bg-rose-50", glow: "shadow-rose-500/10" },
    { label: "Impact Score", value: volunteerData?.impactScore?.toFixed(1) || "0.0", icon: Star, color: "text-amber-600", bg: "bg-amber-50", glow: "shadow-amber-500/10" },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* Premium Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 p-12 glass rounded-[3.5rem] border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-500/20 ring-4 ring-white rotate-3">
             {user?.name?.[0] || "V"}
          </div>
          <div>
            <div className="flex items-center gap-4 mb-3">
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground decoration-primary/20 decoration-8 underline-offset-8">
                 Namaste, <span className="text-primary">{user?.name?.split(' ')[0]}</span>!
               </h1>
               <div className="hidden md:flex px-4 py-1.5 glass bg-white/40 border-white/60 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                  Verified Mentor
               </div>
            </div>
            <p className="text-foreground/50 font-bold text-lg italic max-w-xl leading-relaxed">
              "To teach is to learn twice." — You're making an incredible impact on India's future today.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-4">
           <Link href="/dashboard/volunteer/sessions/new" className="px-10 py-5 bg-primary text-white rounded-[1.8rem] font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
              <Zap className="w-6 h-6" />
              New Session
           </Link>
           <Link href="/dashboard/volunteer/students" className="px-10 py-5 glass bg-white/40 border-white/60 text-foreground/70 rounded-[1.8rem] font-black text-lg hover:bg-white/60 hover:scale-105 active:scale-95 transition-all text-center">
              View Students
           </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((stat, idx) => (
          <div key={idx} className={cn(
            "p-10 glass rounded-[3rem] border-white/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group",
            stat.glow
          )}>
             <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-12", stat.bg)}>
                <stat.icon className={cn("w-8 h-8", stat.color)} />
             </div>
             <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black tracking-tighter text-foreground">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Upcoming Tasks Section */}
         <section className="space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl">
                     <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black tracking-tight">Timeline</h2>
                     <p className="text-foreground/40 font-bold text-xs uppercase tracking-widest">Next 24 hours</p>
                  </div>
               </div>
               <Link href="/dashboard/volunteer/sessions" className="glass px-6 py-3 rounded-2xl text-primary font-black hover:scale-105 transition-all">View All</Link>
            </div>
            
            <div className="space-y-6">
               {upcomingTasks.length > 0 ? (
                 upcomingTasks.map((task) => (
                   <div key={task.id} className="group relative p-8 glass rounded-[2.5rem] border-white/60 hover:-translate-y-2 transition-all duration-500 shadow-xl flex items-center justify-between overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white group-hover:rotate-12">
                            <Play className="w-7 h-7 fill-current" />
                         </div>
                         <div>
                            <h4 className="font-black text-xl mb-1 group-hover:text-primary transition-colors">{task.title}</h4>
                            <p className="text-sm font-bold text-foreground/40 italic flex items-center gap-1.5">
                               {task.student} • <span className="text-primary/60">{task.time}</span>
                            </p>
                         </div>
                      </div>
                      <Link href={`/dashboard/volunteer/sessions/${task.id}`} className="w-12 h-12 glass bg-white/40 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg active:scale-90">
                         <ArrowRight className="w-6 h-6" />
                      </Link>
                   </div>
                 ))
               ) : (
                  <div className="p-16 glass border-2 border-dashed border-primary/20 rounded-[3rem] text-center flex flex-col items-center justify-center group overflow-hidden relative">
                     <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-6">
                        <Calendar className="w-10 h-10 text-primary/30" />
                     </div>
                     <p className="text-xl font-black text-foreground/30 mb-8 italic">No live sessions today.</p>
                     <Link href="/dashboard/volunteer/sessions/new" className="px-10 py-4 bg-primary text-white rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-primary/20">
                        Schedule Session
                     </Link>
                  </div>
               )}
            </div>
            
            <Link href="/dashboard/volunteer/calendar" className="block w-full py-6 glass bg-white/20 border-border border-dashed border-2 rounded-[2.5rem] text-center font-black text-foreground/30 hover:text-primary hover:border-primary/40 hover:bg-white/40 transition-all text-xl">
               View Full Calendar
            </Link>
         </section>

         {/* AI & Impact Section */}
         <section className="space-y-12">
            <div>
               <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-indigo-500/10 rounded-2xl">
                     <Sparkles className="w-8 h-8 text-indigo-500" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black tracking-tight text-foreground">AI Intelligence</h2>
                     <p className="text-foreground/40 font-bold text-xs uppercase tracking-widest">Turbo-charge your impact</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 gap-8">
                  <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                     {/* Dynamic Background Polish */}
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/30 to-violet-600/30 opacity-50 group-hover:opacity-80 transition-opacity"></div>
                     <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
                     
                     <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mb-8 border border-white/20 shadow-2xl rotate-3 group-hover:rotate-12 transition-transform">
                           <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-black mb-4 tracking-tight leading-tight">Lesson Plan Generator</h3>
                        <p className="text-white/60 text-lg mb-10 font-bold leading-relaxed">
                           "I can draft a creative, 45-min structured lesson plan for any topic in seconds."
                        </p>
                        <Link href="/dashboard/volunteer/ai-tools?tool=lesson-plan" className="px-10 py-4 bg-white text-slate-900 rounded-[2rem] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3">
                           Craft Syllabus
                           <ArrowRight className="w-5 h-5" />
                        </Link>
                     </div>
                  </div>

                  <Link href="/dashboard/volunteer/ai-tools?tool=workshop" className="group p-8 glass rounded-[2.5rem] border-white/60 shadow-xl flex items-center justify-between hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     
                     <div className="flex items-center gap-8 relative z-10">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-lg shadow-accent/5">
                           <BarChart3 className="w-8 h-8" />
                        </div>
                        <div>
                           <h4 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">Workshop Blueprint</h4>
                           <p className="text-foreground/45 font-bold italic">Scale your knowledge across groups</p>
                        </div>
                     </div>
                     <div className="w-12 h-12 glass bg-white/40 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-md">
                        <ArrowRight className="w-6 h-6" />
                     </div>
                  </Link>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
