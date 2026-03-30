"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Calendar as CalendarIcon, Clock, User, 
  ChevronRight, Filter, Search, Play, ArrowRight, Star, Loader2, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getSessionsForUser } from "@/lib/db";
import toast from "react-hot-toast";

export default function StudentSessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    async function fetchSessions() {
      if (!user) return;
      try {
        const data = await getSessionsForUser(user.uid, "student");
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [user]);

  const filtered = sessions.filter(s => {
    const isTabMatch = activeTab === "upcoming" ? s.status === "scheduled" : s.status === "completed";
    const isSearchMatch = s.topic?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.mentorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return isTabMatch && isSearchMatch;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Sessions</h1>
          <p className="text-foreground/50 mt-1 font-medium italic">"The roots of education are bitter, but the fruit is sweet."</p>
        </div>
        <button 
          onClick={() => toast.success("Opening Mentor Discovery...")}
          className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Book New Session
        </button>
      </header>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-[2rem] border border-border shadow-sm">
         <div className="flex p-1.5 bg-background rounded-2xl w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "flex-1 sm:flex-none px-8 py-2.5 rounded-xl font-bold text-sm transition-all",
                activeTab === "upcoming" ? "bg-white text-primary shadow-sm" : "text-foreground/40 hover:text-foreground/60"
              )}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab("past")}
              className={cn(
                "flex-1 sm:flex-none px-8 py-2.5 rounded-xl font-bold text-sm transition-all",
                activeTab === "past" ? "bg-white text-primary shadow-sm" : "text-foreground/40 hover:text-foreground/60"
              )}
            >
              Past
            </button>
         </div>
         <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
               <input 
                 type="text" 
                 placeholder="Search session..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
               />
            </div>
            <button className="p-2.5 bg-background border border-border rounded-xl text-foreground/40 hover:text-primary">
               <Filter className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.length > 0 ? (
          filtered.map((s) => (
            <div key={s.id} className="p-8 bg-white rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/5 flex items-center justify-center text-xl font-bold text-primary">
                        {s.mentorName?.[0] || "M"}
                     </div>
                     <div>
                        <h3 className="font-bold text-lg">{s.topic || s.title}</h3>
                        <p className="text-sm text-foreground/50 font-medium">{s.mentorName} • {s.subject}</p>
                     </div>
                  </div>
                  {s.status === "scheduled" ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-bold text-accent uppercase tracking-wider">
                       <Clock className="w-3 h-3" />
                       Soon
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-warning">
                       {[...Array(5)].map((_, i) => (
                         <Star 
                           key={i} 
                           className={cn("w-4 h-4", i < (s.studentRating || 0) ? "fill-warning" : "text-border")} 
                         />
                       ))}
                    </div>
                  )}
               </div>

               <div className="flex items-center gap-4 p-4 bg-background rounded-2xl mb-8 font-bold text-foreground/60">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    {new Date(s.scheduledAt?.seconds * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
               </div>

               <div className="flex items-center gap-3">
                  {s.status === "scheduled" ? (
                    <>
                      <button className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                         <Play className="w-4 h-4" />
                         Join Session
                      </button>
                      <button className="px-5 py-3 border border-border rounded-xl font-bold text-foreground/40 hover:text-danger hover:border-danger hover:bg-danger/5 transition-all">
                         Reschedule
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 py-3 bg-secondary border border-border rounded-xl font-bold text-foreground/60 flex items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary transition-all">
                         <BookOpen className="w-4 h-4" />
                         Session Notes
                      </button>
                      <button className="flex-1 py-3 bg-accent/5 text-accent rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/10 transition-all">
                         Watch Recording
                      </button>
                    </>
                  )}
               </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 py-32 flex flex-col items-center text-center">
             <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary/40 mb-6">
                <CalendarIcon className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-bold mb-2">No {activeTab} sessions</h3>
             <p className="text-foreground/50 max-w-sm mb-8 font-medium leading-relaxed">
                Connect with a mentor to start your learning journey with Vidyastaan.
             </p>
             <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
                Discover Mentors
                <ArrowRight className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

