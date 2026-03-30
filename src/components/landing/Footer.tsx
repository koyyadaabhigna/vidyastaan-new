import React from "react";
import Link from "next/link";
import { Globe, Mail, Phone, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Vidyastaan</h2>
            <p className="text-background/70 leading-relaxed text-lg italic">
              "Vidyastaan — a new possibility for every child."
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary transition-colors">
                <Globe className="w-5 h-5 text-white" />
              </Link>
              <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary transition-colors">
                <Mail className="w-5 h-5 text-white" />
              </Link>
              <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary transition-colors">
                <Phone className="w-5 h-5 text-white" />
              </Link>
              <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary transition-colors">
                <Shield className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">Platform</h3>
            <ul className="flex flex-col gap-4 text-background/70 text-lg">
              <li><Link href="/auth/register/student" className="hover:text-primary transition-colors">Find a Mentor</Link></li>
              <li><Link href="/volunteer/apply" className="hover:text-primary transition-colors">Become a Volunteer</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Explore Workshops</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Learning Resources</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">About</h3>
            <ul className="flex flex-col gap-4 text-background/70 text-lg">
              <li><Link href="#" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Impact Reports</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Partner with NGOs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-background/70 text-lg">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>hello@Vidyastaan.org</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 1800-Vidyastaan</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 text-center text-background/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Vidyastaan Platform. All rights reserved. Created with ❤️ for rural education in India.</p>
        </div>
      </div>
    </footer>
  );
}
