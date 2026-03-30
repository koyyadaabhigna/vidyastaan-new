"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, CheckCircle2, XCircle, Search, 
  Filter, MoreHorizontal, FileText, ArrowRight,
  User, Mail, Phone, MapPin, GraduationCap, Target, Clock, ShieldCheck, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { getPendingApplications, approveVolunteer, rejectVolunteer } from "@/lib/db";

export default function AdminVolunteersPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "rejected">("pending");
  const [selectedVol, setSelectedVol] = useState<any>(null);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, [activeTab]);

  async function fetchVolunteers() {
    setLoading(true);
    try {
      if (activeTab === "pending") {
        const data = await getPendingApplications();
        setVolunteers(data);
      } else {
        setVolunteers([]);
      }
    } catch (error) {
      console.error("Fetch volunteers error:", error);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id: string, uid: string) => {
    try {
      await approveVolunteer(id, uid);
      toast.success("Volunteer Application Approved!");
      setSelectedVol(null);
      fetchVolunteers();
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Approval failed.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectVolunteer(id);
      toast.success("Volunteer Application Rejected.");
      setSelectedVol(null);
      fetchVolunteers();
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error("Rejection failed.");
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Volunteer Management</h1>
          <p className="text-foreground/50 mt-1 font-medium italic">"The life and blood of Vidyastaan."</p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-2 text-primary font-bold text-sm">
              <Users className="w-5 h-5" />
              {volunteers.length} {activeTab} Volunteers
           </div>
        </div>
      </header>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-[2.5rem] border border-border shadow-sm">
         <div className="flex p-1.5 bg-background rounded-2xl w-full sm:w-auto">
            {["pending", "active", "rejected"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "flex-1 sm:flex-none px-8 py-2.5 rounded-xl font-bold text-sm transition-all capitalize",
                  activeTab === tab ? "bg-white text-primary shadow-sm" : "text-foreground/40 hover:text-foreground/60"
                )}
              >
                {tab}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
               <input 
                 type="text" 
                 placeholder="Search by name/institution..."
                 className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm font-medium outline-none"
               />
            </div>
            <button className="p-2.5 bg-background border border-border rounded-xl text-foreground/40 hover:text-primary">
               <Filter className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="md:col-span-3 py-20 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : volunteers.length > 0 ? (
          volunteers.map((v: any) => (
            <div key={v.id} className="p-8 bg-white rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-[1.5rem] bg-background border border-border flex items-center justify-center text-2xl font-bold text-primary">
                        {(v.fullName || v.name || "V")[0]}
                     </div>
                     <div>
                        <h3 className="font-extrabold text-lg text-foreground">{v.fullName || v.name}</h3>
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{v.institution}</p>
                     </div>
                  </div>
                  <div className="text-[10px] font-bold text-foreground/20 px-3 py-1 bg-background border border-border rounded-full">
                     {v.submittedAt ? new Date(v.submittedAt.seconds * 1000).toLocaleDateString() : "Recently"}
                  </div>
               </div>

               <div className="flex flex-wrap gap-2 mb-8">
                  <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg border border-primary/10 capitalize">
                     {v.type || v.deliveryType}
                  </div>
                  {(v.subjects || []).slice(0, 2).map((s: string) => (
                    <div key={s} className="px-3 py-1 bg-background text-foreground/40 text-[10px] font-bold rounded-lg border border-border">
                       {s}
                    </div>
                  ))}
               </div>

               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedVol(v)}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                     Review Application
                  </button>
                  <button className="p-3 bg-secondary border border-border rounded-xl hover:text-primary transition-all">
                     <MoreHorizontal className="w-5 h-5" />
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-3 py-32 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary/40 mb-6">
                <Users className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-foreground/30">No {activeTab} volunteers found</h3>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedVol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-10 border-b border-border bg-gradient-to-br from-background to-white relative flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-primary/20">
                       {(selectedVol.fullName || selectedVol.name || "V")[0]}
                    </div>
                    <div>
                       <h2 className="text-3xl font-extrabold tracking-tight">{selectedVol.fullName || selectedVol.name}</h2>
                       <div className="flex items-center gap-3 text-sm font-bold text-foreground/40 mt-1 uppercase tracking-widest">
                          {selectedVol.institution} • Age {selectedVol.age}
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => setSelectedVol(null)}
                   className="p-5 hover:bg-background rounded-full transition-all"
                 >
                    <XCircle className="w-8 h-8 text-foreground/20" />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 p-10 overflow-y-auto space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <section className="space-y-4">
                          <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                             <FileText className="w-4 h-4" />
                             Personal Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-background border border-border rounded-xl">
                                <p className="text-[10px] font-bold text-foreground/30 uppercase mb-1">Mobile</p>
                                <p className="text-sm font-bold">{selectedVol.mobile || selectedVol.personalInfo?.mobile}</p>
                             </div>
                             <div className="p-4 bg-background border border-border rounded-xl">
                                <p className="text-[10px] font-bold text-foreground/30 uppercase mb-1">Email</p>
                                <p className="text-sm font-bold truncate">{selectedVol.email || selectedVol.personalInfo?.email}</p>
                             </div>
                          </div>
                       </section>

                       <section className="space-y-4">
                          <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                             <Target className="w-4 h-4" />
                             Volunteering Path
                          </h4>
                          <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                             <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                   <GraduationCap className="w-6 h-6 text-primary" />
                                </div>
                                <h5 className="font-extrabold">{selectedVol.type || selectedVol.deliveryType} Support</h5>
                             </div>
                             <p className="text-sm font-medium text-foreground/50 leading-relaxed">
                                Subjects: {(selectedVol.subjects || []).join(", ")}
                             </p>
                             <p className="text-sm font-medium text-foreground/50 mt-1">
                                Grades: {(selectedVol.academic?.grades || []).join(", ")}
                             </p>
                          </div>
                       </section>
                    </div>

                    <div className="space-y-8">
                       <section className="space-y-4">
                          <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                             <CheckCircle2 className="w-4 h-4" />
                             Verification Documents
                          </h4>
                          <button className="w-full p-8 border-2 border-dashed border-border hover:border-primary hover:text-primary rounded-3xl transition-all flex flex-col items-center justify-center gap-4">
                             <ShieldCheck className="w-10 h-10 text-foreground/20" />
                             <span className="font-extrabold text-sm">View ID Proof (College ID)</span>
                          </button>
                       </section>

                       <section className="space-y-4">
                          <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                             <Clock className="w-4 h-4" />
                             Availability
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             {(selectedVol.availability?.days || []).map((d: string) => (
                               <div key={d} className="px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground/60">
                                  {d} • {selectedVol.availability?.slots?.[0] || "Slot"}
                               </div>
                             ))}
                          </div>
                          <p className="text-xs font-bold text-primary mt-2 flex items-center gap-2 uppercase tracking-widest">
                             <Clock className="w-4 h-4" />
                             {selectedVol.availability?.hoursPerWeek || "N/A"} Per Week
                          </p>
                       </section>
                    </div>
                 </div>

                 <section className="p-8 bg-background border border-border rounded-[2.5rem] space-y-4">
                    <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">Motivation for joining</h4>
                    <p className="font-medium text-foreground/60 leading-relaxed italic">
                       "{selectedVol.motivation?.why || "No motivation statement provided."}"
                    </p>
                 </section>
              </div>

              {/* Modal Footer */}
              <div className="p-10 border-t border-border bg-white flex items-center gap-4">
                 <button 
                   onClick={() => handleReject(selectedVol.id)}
                   className="flex-1 py-4 border-2 border-border rounded-2xl font-bold text-foreground/40 hover:text-danger hover:border-danger hover:bg-danger/5 transition-all outline-none"
                 >
                    Reject Application
                 </button>
                 <button className="flex-1 py-4 bg-background border border-border rounded-2xl font-bold text-foreground/60 hover:text-primary hover:border-primary transition-all">
                    Request Info
                 </button>
                 <button 
                   onClick={() => handleApprove(selectedVol.id, selectedVol.uid)}
                   className="flex-[2] py-4 bg-accent text-white rounded-2xl font-bold shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-3"
                 >
                    Approve Application
                    <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
