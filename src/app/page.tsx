import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import HowItWorks from "@/components/landing/HowItWorks";
import ProblemStatement from "@/components/landing/ProblemStatement";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen relative">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <ProblemStatement />
      <Features />
      <Footer />
    </main>
  );
}
