"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, User, Mail, Lock, GraduationCap, Loader2, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { createUserProfile, updateStudentProfile } from "@/lib/db";

export default function StudentRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    grade: "10",
    studentPhone: "",
    parentName: "",
    parentPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Auth User
      const user = await register(formData.email, formData.password);
      
      // 2. Create User Profile
      await createUserProfile(user.uid, {
        name: formData.name,
        email: formData.email,
        role: "student",
        phone: formData.studentPhone,
        language: "English", // Default
      });

      // 3. Create Student Profile
      await updateStudentProfile(user.uid, {
        grade: formData.grade,
        status: "unassigned",
        progressScore: 0,
        streak: 0,
        badges: [],
        assignedVolunteerId: null,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
      });

      toast.success("Account created! Welcome to Vidyastaan.");
      router.push("/onboarding/student");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-8 sm:mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-foreground tracking-tight">
          Join as a Student
        </h2>
        <p className="mt-2 text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-primary/5 sm:rounded-3xl sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground/70">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-foreground/40" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="Rahul Kumar"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/70">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-foreground/40" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="rahul@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-foreground/70">
                Current Grade
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-foreground/40" aria-hidden="true" />
                </div>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all appearance-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                    <option key={g} value={g.toString()}>Grade {g}</option>
                  ))}
                  <option value="11">Grade 11 (Intermediate)</option>
                  <option value="12">Grade 12 (Intermediate)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="studentPhone" className="block text-sm font-medium text-foreground/70">
                Your Mobile Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-foreground/40" aria-hidden="true" />
                </div>
                <input
                  id="studentPhone"
                  name="studentPhone"
                  type="tel"
                  required
                  value={formData.studentPhone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-foreground/70">
                Parent/Guardian Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-foreground/40" aria-hidden="true" />
                </div>
                <input
                  id="parentName"
                  name="parentName"
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="Father/Mother/Guardian Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="parentPhone" className="block text-sm font-medium text-foreground/70">
                Parent Mobile Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-foreground/40" aria-hidden="true" />
                </div>
                <input
                  id="parentPhone"
                  name="parentPhone"
                  type="tel"
                  required
                  value={formData.parentPhone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground/70">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-foreground/40" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </button>
            </div>
            
            <p className="text-xs text-center text-foreground/40 leading-relaxed px-4">
               By registering, you agree to Vidyastaan's Code of Conduct and Privacy Policy for student safety.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
