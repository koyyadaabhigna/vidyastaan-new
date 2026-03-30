import React from "react";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/50 backdrop-blur-md border border-white/40 text-primary text-sm font-bold mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
              India's Leading Peer-to-Peer Learning Platform
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-4 leading-[1]">
              Vidyastaan
            </h1>

            <p className="text-2xl md:text-3xl text-primary font-bold italic mb-6 tracking-wide drop-shadow-sm">
              a new possibility for every child
            </p>

            <p className="text-xl text-foreground/70 mb-10 max-w-xl leading-relaxed font-medium">
              We connect underserved school students with world-class college mentors to bridge the education gap and unlock every child's true potential.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link 
                href="/auth/register/student" 
                className="px-10 py-5 rounded-3xl bg-primary text-white font-bold text-xl transition-all hover:bg-primary/90 hover:scale-105 shadow-2xl shadow-primary/30 flex items-center gap-3"
              >
                I'm a Student
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link 
                href="/volunteer/apply" 
                className="px-10 py-5 rounded-3xl glass bg-white/40 text-primary font-bold text-xl transition-all hover:bg-white/60 hover:scale-105 flex items-center gap-3"
              >
                Become a Volunteer
                <Play className="w-5 h-5 fill-primary" />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 opacity-60">
               <div className="flex items-center gap-2 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  1-on-1 Mentorship
               </div>
               <div className="flex items-center gap-2 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  AI Study Buddy
               </div>
               <div className="flex items-center gap-2 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Skill Workshops
               </div>
            </div>
          </div>

          {/* Visual Content - Real Photography Showcase */}
          <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
            <div className="relative z-10 p-4">
               {/* Main Large Image Container with Premium Glow */}
               <div className="relative group perspective-1000">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-[4rem] blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative aspect-square rounded-[3.5rem] overflow-hidden shadow-[0_48px_96px_-24px_rgba(79,70,229,0.4)] border-[12px] border-white/80 backdrop-blur-sm transition-all duration-700 transform group-hover:rotate-2 group-hover:scale-[1.02]">
                     <img 
                       src="/hero-main.jpg" 
                       alt="Vidyastaan Excellence" 
                       className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
               </div>

               {/* Floating Glass Cards */}
               <div className="absolute -top-4 -right-8 glass p-6 rounded-3xl animate-bounce transition-all duration-[3000ms] shadow-2xl">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl">🎓</span>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">Active Mentors</p>
                        <p className="text-xl font-bold text-foreground">1,200+</p>
                     </div>
                  </div>
               </div>

               <div className="absolute -bottom-8 -left-8 glass p-6 rounded-3xl shadow-2xl animate-pulse">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-accent/60 uppercase tracking-widest">Impact Made</p>
                        <p className="text-xl font-bold text-foreground">10k+ Sessions</p>
                     </div>
                  </div>
               </div>

               {/* Design Flourishes */}
               <div className="absolute -z-10 -bottom-20 -right-20 w-64 h-64 border-2 border-primary/10 rounded-full animate-spin-slow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
