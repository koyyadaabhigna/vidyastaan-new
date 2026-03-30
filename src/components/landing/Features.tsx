import React from "react";
import { Zap, Phone, Heart, BarChart3, Binary, Globe, ShieldCheck, Rocket } from "lucide-react";

const features = [
  {
    title: "AI-Powered Matching",
    desc: "Our smart algorithms find the perfect mentor based on grade, subjects, and language.",
    icon: <Zap className="w-8 h-8" />,
    color: "bg-indigo-500",
    glow: "shadow-indigo-500/20",
  },
  {
    title: "Voice Access Helpers",
    desc: "Students can interact via phone calls if they lack internet access or smartphones.",
    icon: <Phone className="w-8 h-8" />,
    color: "bg-cyan-500",
    glow: "shadow-cyan-500/20",
  },
  {
    title: "Skill Workshops",
    desc: "From coding to financial literacy, go beyond textbooks with expert-led sessions.",
    icon: <Heart className="w-8 h-8" />,
    color: "bg-rose-500",
    glow: "shadow-rose-500/20",
  },
  {
    title: "NGO Impact Dashboard",
    desc: "Real-time tracking of student progress and volunteer engagement for our partners.",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "bg-violet-500",
    glow: "shadow-violet-500/20",
  },
];

export default function Features() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 tracking-widest uppercase">
            Platform Capabilities
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Built for massive impact.</h2>
          <p className="text-foreground/70 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
            We've engineered Vidyastaan to handle the complexity of local communities while offering global-standard tools for mentors and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group relative p-10 rounded-[3rem] glass transition-all duration-500 hover:scale-105 hover:-translate-y-4 shadow-2xl overflow-hidden border-white/60"
            >
              {/* Inner Glow Effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${feature.color}/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity duration-500 opacity-0 group-hover:opacity-100`}></div>
              
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 ${feature.color} text-white shadow-lg ${feature.glow} ring-4 ring-white transition-transform duration-500 group-hover:rotate-12`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-foreground/60 leading-relaxed text-lg font-medium">
                {feature.desc}
              </p>

              <div className="mt-8 flex items-center gap-2 text-primary font-bold opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                 Learn more <Rocket className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
