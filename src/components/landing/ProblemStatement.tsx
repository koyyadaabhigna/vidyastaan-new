import React from "react";
import { AlertCircle, TrendingDown, Clock } from "lucide-react";

const problems = [
  {
    icon: <AlertCircle className="w-12 h-12 text-rose-500" />,
    stat: "58%",
    desc: "of government school students lack a trained mentor for personalized guidance.",
    glow: "shadow-rose-500/20",
  },
  {
    icon: <TrendingDown className="w-12 h-12 text-rose-600" />,
    stat: "70%",
    desc: "of tutoring programs have no progress tracking, leading to learning gaps.",
    glow: "shadow-rose-600/20",
  },
  {
    icon: <Clock className="w-12 h-12 text-rose-700" />,
    stat: "1 in 3",
    desc: "children fall behind their grade level by Grade 5 without early intervention.",
    glow: "shadow-rose-700/20",
  },
];

export default function ProblemStatement() {
  return (
    <section className="py-32 bg-white/50 backdrop-blur-sm relative border-y border-white/40">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-24">
          <span className="text-rose-600 font-black uppercase tracking-[0.3em] text-xs bg-rose-50 px-6 py-2 rounded-full border border-rose-100 shadow-sm">
            Critical Gap
          </span>
          <h2 className="text-4xl md:text-6xl font-black mt-8 mb-6 tracking-tight">The crisis we're solving.</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
            The education gap in India is widening. We're on a mission to ensure every child gets the attention they deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {problems.map((problem, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col items-center text-center p-12 glass rounded-[3.5rem] shadow-2xl transition-all duration-500 border-white/60 hover:-translate-y-4 hover:shadow-[0_32px_64px_-16px_rgba(225,29,72,0.1)]"
            >
              <div className={`mb-10 bg-rose-50 p-6 rounded-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg ${problem.glow}`}>
                {problem.icon}
              </div>
              <div className="text-6xl font-black text-rose-600 mb-6 tracking-tighter tabular-nums drop-shadow-sm">
                {problem.stat}
              </div>
              <p className="text-foreground/70 text-lg leading-relaxed font-semibold px-4 italic opacity-80">
                "{problem.desc}"
              </p>
              
              {/* Animated line decorator */}
              <div className="w-12 h-1 bg-rose-200 rounded-full mt-10 transition-all duration-500 group-hover:w-full group-hover:bg-rose-500/30"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.03)_0%,transparent_70%)] pointer-events-none"></div>
    </section>
  );
}
