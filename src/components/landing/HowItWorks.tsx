import React from "react";
import { UserPlus, Search, GraduationCap, ClipboardCheck, Award } from "lucide-react";

const studentSteps = [
  {
    title: "Join Vidyastaan",
    desc: "Register in seconds with your grade and language preferences.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Get Matched",
    desc: "Our AI pairs you with a college mentor perfect for your needs.",
    icon: <Search className="w-8 h-8 text-primary" />,
  },
  {
    title: "Excel Together",
    desc: "Master subjects and pick up 21st-century skills in weekly sessions.",
    icon: <GraduationCap className="w-8 h-8 text-primary" />,
  },
];

const volunteerSteps = [
  {
    title: "Submit Application",
    desc: "Share your background and what you care about teaching.",
    icon: <ClipboardCheck className="w-8 h-8 text-accent" />,
  },
  {
    title: "Expert Approval",
    desc: "Our team verifies your profile to ensure safe, quality learning.",
    icon: <Search className="w-8 h-8 text-accent" />,
  },
  {
    title: "Earn Certifications",
    desc: "Teach, impact lives, and receive certificates for your portfolio.",
    icon: <Award className="w-8 h-8 text-accent" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
            A simple, verified process to bridge the gap between curiosity and mentorship.
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-8 text-primary/80 uppercase tracking-widest text-center">For Students</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studentSteps.map((step, idx) => (
              <StepCard key={idx} {...step} color="primary" />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-8 text-accent/80 uppercase tracking-widest text-center">For Volunteers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {volunteerSteps.map((step, idx) => (
              <StepCard key={idx} {...step} color="accent" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ title, desc, icon, color }: { title: string; desc: string; icon: React.ReactNode; color: string }) {
  return (
    <div className={`p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl transition-all duration-300 group`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-sm ring-1 ring-border group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-foreground/70 leading-relaxed">{desc}</p>
    </div>
  );
}
