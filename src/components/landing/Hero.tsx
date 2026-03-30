import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            India's #1 Peer-to-Peer Learning Platform
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground mb-3 max-w-4xl leading-[1.05]">
            Vidyastaan
          </h1>

          <p className="text-xl md:text-2xl text-primary font-semibold italic mb-10 tracking-wide">
            a new possibility for every child
          </p>

          <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl">
            Vidyastaan connects underserved school students with passionate college volunteers for academic support and real-world skill development.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/auth/register/student" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg transition-all hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/20"
            >
              I'm a Student
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/volunteer/apply" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white border-2 border-primary/20 text-primary font-semibold text-lg transition-all hover:border-primary hover:bg-primary/5 hover:scale-105"
            >
              Become a Volunteer
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-16 relative w-full max-w-5xl">
             <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border border-white/40 overflow-hidden shadow-2xl relative grayscale-[0.2] transition-transform duration-700 hover:scale-[1.02]">
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-primary font-medium text-lg bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-primary/10 flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      Empowering 10k+ Student-Volunteer Pairs
                   </div>
                </div>
             </div>
             {/* Floaties */}
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-2xl blur-xl -z-10 animate-bounce transition-all duration-[3000ms]"></div>
             <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10 animate-pulse transition-all duration-[4000ms]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
