"use client";

import React from "react";
import { 
  Award, Heart, Users, Clock, 
  TrendingUp, Download, Share2, 
  CheckCircle2, Sparkles, ExternalLink, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const IMPACT_STATS = [
  { label: "Total Sessions", value: "24", icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  { label: "Students Impacted", value: "12", icon: Users, color: "text-accent", bg: "bg-accent/10" },
  { label: "Volunteering Hours", value: "36", icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
  { label: "Impact Score", value: "9.2", icon: Heart, color: "text-danger", bg: "bg-danger/10" },
];

const RECENT_ACHIEVEMENTS = [
  { id: "1", title: "Monthly Mentor Hero", date: "March 2026", desc: "Recognized for consistent session quality and student feedback." },
  { id: "2", title: "10-Session Milestone", date: "Feb 28, 2026", desc: "Completed 10 academic support sessions with high ratings." },
  { id: "3", title: "Certified Python Mentor", date: "Feb 15, 2026", desc: "Verified as a workshop lead for basic programming." },
];

export default function VolunteerImpactPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Impact Dashboard</h1>
          <p className="text-foreground/50 mt-1 font-medium">Measuring the lives you've touched through Vidyastaan.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => toast.success("Generating Shareable Link...")}
             className="px-6 py-3 bg-white border border-border text-foreground/60 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-background transition-all"
           >
             <Share2 className="w-5 h-5" />
             Share Impact
           </button>
           <button 
             onClick={() => toast.success("Downloading Certificate...")}
             className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
           >
             <Download className="w-5 h-5" />
             Download Certificate
           </button>
        </div>
      </header>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {IMPACT_STATS.map((stat, idx) => (
          <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
             </div>
             <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-3xl font-extrabold tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Certificate Preview (Left) */}
         <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-12 rounded-[3.5rem] border border-border shadow-2xl shadow-primary/5 relative overflow-hidden flex flex-col items-center text-center">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Award className="w-64 h-64" />
               </div>
               
               <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-8">
                  <Award className="w-10 h-10 text-primary" />
               </div>
               
               <h2 className="text-base font-bold text-primary uppercase tracking-[0.3em] mb-4">Certificate of Impact</h2>
               <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">Aditya Verma</h3>
               <p className="text-foreground/50 max-w-lg mx-auto leading-relaxed font-medium italic mb-10">
                  "In recognition of your exceptional commitment to education equality, having completed 24 mentorship sessions and hosted 5 workshops on the Vidyastaan platform."
               </p>
               
               <div className="grid grid-cols-3 gap-8 w-full max-w-md pt-8 border-t border-border mt-auto">
                  <div>
                     <p className="text-2xl font-extrabold text-foreground">36</p>
                     <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest mt-1">Hours</p>
                  </div>
                  <div>
                     <p className="text-2xl font-extrabold text-foreground">12</p>
                     <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest mt-1">Students</p>
                  </div>
                  <div>
                     <p className="text-2xl font-extrabold text-foreground">A+</p>
                     <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest mt-1">Rating</p>
                  </div>
               </div>
               
               <div className="mt-12 flex items-center gap-4 text-xs font-bold text-foreground/30">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified on March 30, 2026
               </div>
            </section>
         </div>

         {/* Achievements (Right) */}
         <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
               <Sparkles className="w-6 h-6 text-warning" />
               Achievements
            </h2>
            <div className="space-y-6">
               {RECENT_ACHIEVEMENTS.map((a) => (
                 <div key={a.id} className="p-6 bg-white rounded-3xl border border-border hover:shadow-lg transition-all group">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full">{a.date}</p>
                       <Award className="w-5 h-5 text-foreground/20 group-hover:text-warning transition-colors" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">{a.title}</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed font-medium">{a.desc}</p>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 bg-background border border-dashed border-border rounded-3xl font-bold text-foreground/40 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2">
               View Full Impact Log
               <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
