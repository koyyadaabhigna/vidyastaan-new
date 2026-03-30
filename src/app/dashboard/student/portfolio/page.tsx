"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, Star, Zap, Code, Palette, Mic, 
  Search, Filter, Lock, CheckCircle2, Share2, 
  ArrowRight, Download, ExternalLink, Sparkles, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getStudentProfile } from "@/lib/db";
import toast from "react-hot-toast";

const ALL_BADGES = [
  { id: "grammar", name: "Grammar Guru", icon: "✍️", requirement: "Complete 3 English sessions" },
  { id: "math", name: "Math Whiz", icon: "🔢", requirement: "Complete 3 Math sessions" },
  { id: "python", name: "Python Pro", icon: "🐍", requirement: "Complete 5 Coding sessions" },
  { id: "speaker", name: "Public Speaker", icon: "🎤", requirement: "Complete 1 Public Speaking workshop" },
  { id: "app", name: "App Creator", icon: "📱", requirement: "Complete 5 Mobile Dev sessions" },
  { id: "social", name: "Social Star", icon: "🌍", requirement: "Complete 10 Social Studies sessions" },
];

export default function StudentPortfolioPage() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getStudentProfile(user.uid)
      .then(setStudentData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const earnedBadges = studentData?.badges || [];
  
  const MILESTONES = [
    { id: "1", title: "Joined Vidyastaan", date: "Jan 2026", desc: "Started the journey to bridge the education gap." },
    ...(studentData?.sessionCount > 0 ? [{ 
      id: "2", 
      title: "First Session Completed", 
      date: "Feb 2026", 
      desc: "Successfully completed the first 1-on-1 with a mentor." 
    }] : []),
    ...(studentData?.streak >= 5 ? [{ 
      id: "3", 
      title: "5 Day Learning Streak", 
      date: "Mar 2026", 
      desc: "Showed incredible consistency in learning." 
    }] : []),
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Skills Portfolio</h1>
          <p className="text-foreground/50 mt-1 font-medium">Showcase your achievements and milestones.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => toast.success("Generating Shareable Link...")}
             className="px-6 py-3 bg-white border-2 border-primary/20 text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all shadow-lg shadow-primary/5"
           >
             <Share2 className="w-5 h-5" />
             Share Portfolio
           </button>
           <button 
             onClick={() => toast.success("Downloading Certificate...")}
             className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
           >
             <Download className="w-5 h-5" />
             Download PDF
           </button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="p-8 bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20">
            <h3 className="text-lg font-bold opacity-80 mb-6 flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5" />
               Total Impact
            </h3>
            <div className="text-5xl font-extrabold mb-1 tracking-tight">{studentData?.sessionCount || 0}</div>
            <p className="text-xl font-bold opacity-60">Sessions Completed</p>
         </div>
         <div className="p-8 bg-gradient-to-br from-accent to-accent/80 rounded-[2.5rem] text-white shadow-2xl shadow-accent/20">
            <h3 className="text-lg font-bold opacity-80 mb-6 flex items-center gap-2">
               <Award className="w-5 h-5" />
               Skills Mastered
            </h3>
            <div className="text-5xl font-extrabold mb-1 tracking-tight">{earnedBadges.length}</div>
            <p className="text-xl font-bold opacity-60">Verified Skill Badges</p>
         </div>
         <div className="p-8 bg-gradient-to-br from-warning to-warning/80 rounded-[2.5rem] text-white shadow-2xl shadow-warning/20">
            <h3 className="text-lg font-bold opacity-80 mb-6 flex items-center gap-2">
               <Zap className="w-5 h-5" />
               Learning Streak
            </h3>
            <div className="text-5xl font-extrabold mb-1 tracking-tight">{studentData?.streak || 0}</div>
            <p className="text-xl font-bold opacity-60">Successive Days</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Badges Grid (Left) */}
         <div className="lg:col-span-2 space-y-8">
            <section>
               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-warning" />
                  My Badges
               </h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {ALL_BADGES.map((b) => {
                    const isEarned = earnedBadges.includes(b.id);
                    return (
                      <div 
                        key={b.id} 
                        className={cn(
                          "relative p-8 rounded-[2.5rem] text-center transition-all duration-300 group",
                          isEarned 
                            ? "bg-white border-2 border-primary/5 shadow-xl shadow-primary/5 hover:border-primary/20" 
                            : "bg-background border-2 border-border/50 opacity-60 grayscale hover:grayscale-0"
                        )}
                      >
                         <div className="text-5xl mb-4 transform transition-transform group-hover:scale-125 group-hover:rotate-12 duration-500">
                            {b.icon}
                         </div>
                         <h4 className="font-extrabold text-foreground mb-1">{b.name}</h4>
                         {isEarned ? (
                           <p className="text-xs font-bold text-primary">Verified Achievement</p>
                         ) : (
                           <div className="flex flex-col items-center gap-2 mt-2">
                              <Lock className="w-4 h-4 text-foreground/20" />
                              <p className="text-[10px] font-bold text-foreground/40 leading-tight">
                                 {b.requirement}
                              </p>
                           </div>
                         )}
                         {isEarned && (
                           <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="w-4 h-4" />
                           </div>
                         )}
                      </div>
                    );
                  })}
               </div>
            </section>
         </div>

         {/* Timeline (Right) */}
         <div className="space-y-8">
            <section>
               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Milestones
               </h2>
               <div className="relative border-l-2 border-primary/10 pl-8 space-y-12">
                  {MILESTONES.map((m) => (
                    <div key={m.id} className="relative group">
                       <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/5 group-hover:scale-150 transition-transform"></div>
                       <div className="p-6 bg-white rounded-3xl border border-border group-hover:shadow-xl transition-all">
                          <p className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">{m.date}</p>
                          <h4 className="font-bold text-lg mb-2">{m.title}</h4>
                          <p className="text-sm text-foreground/60 leading-relaxed font-medium">{m.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-4 bg-background border border-border rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all text-foreground/40 hover:text-primary">
                  View Full History
                  <ArrowRight className="w-4 h-4" />
               </button>
            </section>
         </div>
      </div>
    </div>
  );
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

