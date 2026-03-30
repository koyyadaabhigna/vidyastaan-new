import React from "react";
import { AlertCircle, TrendingDown, Clock } from "lucide-react";

const problems = [
  {
    icon: <AlertCircle className="w-10 h-10 text-danger" />,
    stat: "58%",
    desc: "of government school students lack a trained mentor for personalized guidance.",
  },
  {
    icon: <TrendingDown className="w-10 h-10 text-danger" />,
    stat: "70%",
    desc: "of tutoring programs have no progress tracking, leading to learning gaps.",
  },
  {
    icon: <Clock className="w-10 h-10 text-danger" />,
    stat: "1 in 3",
    desc: "children fall behind their grade level by Grade 5 without early intervention.",
  },
];

export default function ProblemStatement() {
  return (
    <section className="py-24 bg-background border-y border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-danger font-bold uppercase tracking-widest text-sm bg-danger/10 px-4 py-2 rounded-full ring-1 ring-danger/20">The Challenge</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-6 mb-4">Why Vidyastaan exists</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg leading-relaxed">
            The education gap in India is widening. We're on a mission to ensure every child gets the attention they deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {problems.map((problem, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-sm border border-border group hover:border-danger/30 transition-all">
              <div className="mb-6 bg-danger/5 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                {problem.icon}
              </div>
              <div className="text-5xl font-bold text-danger mb-4 tracking-tight tabular-nums">
                {problem.stat}
              </div>
              <p className="text-foreground/70 text-lg leading-relaxed">
                {problem.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
