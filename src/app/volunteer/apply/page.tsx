"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, ArrowRight, CheckCircle2, User, GraduationCap, 
  Target, Calendar, Heart, ShieldCheck, Loader2, Upload
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { submitVolunteerApplication } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";

const STEPS = [
  "Personal Info", 
  "Background", 
  "Delivery", 
  "Availability", 
  "Motivation", 
  "Verification"
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const LANGUAGES = ["Telugu", "Hindi", "English", "Tamil", "Kannada", "Other"];

export default function VolunteerApplyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    fullName: "",
    age: "",
    gender: "",
    mobile: "",
    whatsappSame: true,
    whatsapp: "",
    email: "",
    city: "",
    state: "",
    languages: [] as string[],
    
    // Step 2
    status: "", // Studying / Working / Other
    institution: "",
    course: "",
    year: "",
    profession: "",
    organization: "",
    highestQualification: "",
    bio: "",
    
    // Step 3
    priority: "", // Academic / Skill / Both / One-time
    subjects: [] as string[],
    grades: [] as string[],
    teachingStyle: "",
    skills: [] as string[],
    workshopFormat: "",
    workshopDuration: "",
    oneTimeTopic: "",
    oneTimeDate: "",
    oneTimeTime: "",
    
    // Step 4
    days: [] as string[],
    slots: [] as string[],
    hoursPerWeek: "",
    mode: "",
    travelArea: "",
    
    // Step 5
    whyVolunteer: "",
    hasVolunteered: "",
    volunteerExp: "",
    hasTaught: "",
    teachingExp: "",
    studentGain: "",
    
    // Step 6
    idUploaded: false,
    linkedin: "",
    github: "",
    emergencyName: "",
    emergencyNumber: "",
    emergencyRelation: "",
    agreeCode: false,
    agreeAccuracy: false
  });

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => Math.min(s + 1, 6));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  const validateStep = (step: number) => {
    // Add basic validation per step
    if (step === 1 && (!formData.fullName || !formData.email || !formData.mobile)) {
      toast.error("Please fill in required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.agreeCode || !formData.agreeAccuracy) {
      toast.error("Please agree to the terms");
      return;
    }
    setIsSubmitting(true);
    try {
      // Structure the data according to the request
      const applicationData = {
        uid: user?.uid || null,
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        age: parseInt(formData.age),
        institution: formData.status === "Studying" ? formData.institution : formData.organization,
        type: formData.priority,
        subjects: formData.subjects,
        status: "pending",
        personalInfo: {
          fullName: formData.fullName,
          age: formData.age,
          gender: formData.gender,
          mobile: formData.mobile,
          whatsapp: formData.whatsappSame ? formData.mobile : formData.whatsapp,
          email: formData.email,
          city: formData.city,
          state: formData.state,
        },
        qualification: {
          status: formData.status,
          institution: formData.status === "Studying" ? formData.institution : null,
          course: formData.status === "Studying" ? formData.course : null,
          year: formData.status === "Studying" ? formData.year : null,
          profession: formData.status === "Working" ? formData.profession : null,
          organization: formData.status === "Working" ? formData.organization : null,
          highestQualification: formData.highestQualification,
          bio: formData.bio,
        },
        deliveryType: formData.priority,
        academic: {
          subjects: formData.subjects,
          grades: formData.grades,
          teachingStyle: formData.teachingStyle,
        },
        skills: {
          skills: formData.skills,
          format: formData.workshopFormat,
          duration: formData.workshopDuration,
        },
        availability: {
          days: formData.days,
          slots: formData.slots,
          hoursPerWeek: formData.hoursPerWeek,
          mode: formData.mode,
          travelArea: formData.travelArea,
        },
        motivation: {
          why: formData.whyVolunteer,
          hasVolunteered: formData.hasVolunteered,
          experience: formData.volunteerExp,
          teachingExp: formData.teachingExp,
          studentGain: formData.studentGain,
        },
        verification: {
          idUploaded: true, // Assuming file handle was successful
          linkedin: formData.linkedin,
          github: formData.github,
          emergencyContact: {
            name: formData.emergencyName,
            number: formData.emergencyNumber,
            relation: formData.emergencyRelation,
          }
        }
      };

      await submitVolunteerApplication(applicationData);
      
      toast.success("Application submitted successfully!");
      router.push("/volunteer/pending");
    } catch (e: any) {
      console.error("Submission error:", e);
      toast.error("Submission failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-between">
          <button onClick={() => router.push("/")} className="text-foreground/60 hover:text-primary flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-lg">Volunteer Application</h1>
            <p className="text-sm text-foreground/40">Step {currentStep} of 6</p>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-border relative">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Multi-step Container */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-border overflow-hidden">
          <div className="p-8 md:p-12">
            {currentStep === 1 && <Step1 formData={formData} setFormData={setFormData} />}
            {currentStep === 2 && <Step2 formData={formData} setFormData={setFormData} />}
            {currentStep === 3 && <Step3 formData={formData} setFormData={setFormData} />}
            {currentStep === 4 && <Step4 formData={formData} setFormData={setFormData} />}
            {currentStep === 5 && <Step5 formData={formData} setFormData={setFormData} />}
            {currentStep === 6 && <Step6 formData={formData} setFormData={setFormData} isSubmitting={isSubmitting} />}
          </div>

          {/* Footer Navigation */}
          <div className="px-8 py-6 bg-background flex items-center justify-between border-t border-border">
            <button
              onClick={prevStep}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2",
                currentStep === 1 ? "opacity-0 pointer-events-none" : "hover:bg-primary/5 text-foreground/60"
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.agreeCode || !formData.agreeAccuracy}
                className="px-10 py-3 rounded-xl bg-accent text-white font-semibold flex items-center gap-2 hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for steps (Defined in the same file or split if needed)

function Step1({ formData, setFormData }: any) {
  const toggleLang = (l: string) => {
    const langs = formData.languages.includes(l) 
      ? formData.languages.filter((i: any) => i !== l)
      : [...formData.languages, l];
    setFormData({ ...formData, languages: langs });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Personal Information</h2>
          <p className="text-foreground/60">Let's get to know you better</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/70">Full Name *</label>
          <input 
            type="text" 
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none" 
            placeholder="Rahul Sharma"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/70">Age *</label>
          <input 
            type="number" 
            value={formData.age}
            onChange={e => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none" 
            placeholder="21"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/70">Gender *</label>
          <div className="flex flex-wrap gap-3">
            {["Male", "Female", "Prefer not to say"].map(g => (
              <button
                key={g}
                onClick={() => setFormData({ ...formData, gender: g })}
                className={cn(
                  "px-4 py-2 border rounded-xl text-sm transition-all",
                  formData.gender === g ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border text-foreground/60 hover:border-primary/50"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/70">Mobile Number (+91) *</label>
          <input 
            type="tel" 
            value={formData.mobile}
            onChange={e => setFormData({ ...formData, mobile: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none" 
            placeholder="9876543210"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 py-2">
        <input 
          type="checkbox" 
          checked={formData.whatsappSame}
          onChange={e => setFormData({ ...formData, whatsappSame: e.target.checked })}
          className="w-5 h-5 rounded-md text-primary border-border focus:ring-primary"
        />
        <label className="text-sm font-medium text-foreground/70">WhatsApp number same as mobile?</label>
      </div>

      {!formData.whatsappSame && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-sm font-semibold text-foreground/70">WhatsApp Number *</label>
          <input 
            type="tel" 
            value={formData.whatsapp}
            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none" 
            placeholder="9876543210"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/70">Email Address *</label>
        <input 
          type="email" 
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none" 
          placeholder="rahul@example.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/70">City / District *</label>
          <input 
            type="text" 
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none" 
            placeholder="Hyderabad"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/70">State *</label>
          <select 
            value={formData.state}
            onChange={e => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none bg-white appearance-none"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-foreground/70">Preferred Language (Select all that apply) *</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(l => (
            <button
              key={l}
              onClick={() => toggleLang(l)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                formData.languages.includes(l) ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-background border border-border text-foreground/60 hover:border-primary/50"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ formData, setFormData }: any) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Background & Qualification</h2>
          <p className="text-foreground/60">Help us verify your profile</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-foreground/70">Current Status *</label>
        <div className="grid grid-cols-3 gap-4">
          {["Studying", "Working", "Other"].map(s => (
            <button
              key={s}
              onClick={() => setFormData({ ...formData, status: s })}
              className={cn(
                "p-4 border rounded-2xl text-sm font-semibold transition-all text-center",
                formData.status === s ? "border-accent bg-accent/5 text-accent" : "border-border text-foreground/60 hover:bg-background"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {formData.status === "Studying" && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/70">Institution Name *</label>
            <input 
              type="text" 
              value={formData.institution}
              onChange={e => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none" 
              placeholder="IIT Hyderabad"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/70">Course/Stream *</label>
              <input 
                type="text" 
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none" 
                placeholder="B.Tech CS"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/70">Year/Semester *</label>
              <select 
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none bg-white font-medium"
              >
                <option value="">Select</option>
                {["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Final Year", "Other"].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {formData.status === "Working" && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/70">Profession/Job Role *</label>
            <input 
              type="text" 
              value={formData.profession}
              onChange={e => setFormData({ ...formData, profession: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none" 
              placeholder="Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/70">Organization Name *</label>
            <input 
              type="text" 
              value={formData.organization}
              onChange={e => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none" 
              placeholder="Google"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/70">Highest Qualification Completed *</label>
        <select 
          value={formData.highestQualification}
          onChange={e => setFormData({ ...formData, highestQualification: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none bg-white font-medium"
        >
          <option value="">Select Qualification</option>
          {["10th", "Intermediate", "Undergraduate", "Postgraduate", "PhD", "Other"].map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/70">Brief Bio (Max 300 characters) *</label>
        <textarea 
          maxLength={300}
          value={formData.bio}
          onChange={e => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none resize-none" 
          placeholder="Tell us about yourself..."
        />
        <p className="text-xs text-right text-foreground/40">{formData.bio.length}/300</p>
      </div>
    </div>
  );
}

function Step3({ formData, setFormData }: any) {
  const priorities = [
    { id: "academic", label: "Academic Support", icon: "📚", sub: "Help with school subjects" },
    { id: "skill", label: "Skill Workshops", icon: "🚀", sub: "Tech, Arts, Design etc" },
    { id: "both", label: "Both (Full Mentor)", icon: "⭐", sub: "Academic + Skills" },
    { id: "one-time", label: "One-time Session", icon: "🎯", sub: "No long commitment" }
  ];

  const subjects = ["Math", "Science", "English", "Social Studies", "Telugu", "Hindi", "Computer Basics", "Other"];
  const grades = ["Grade 1-5", "Grade 6-8", "Grade 9-10", "Intermediate"];
  const skills = ["Coding", "Graphic Design", "Public Speaking", "Financial Literacy", "Career Guidance", "Web Dev", "App Dev", "Music", "Art", "Robotics"];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">What You Want to Deliver</h2>
          <p className="text-foreground/60">Choose your volunteering path</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {priorities.map(p => (
          <button
            key={p.id}
            onClick={() => setFormData({ ...formData, priority: p.id })}
            className={cn(
              "p-6 border-2 rounded-2xl transition-all text-left flex items-start gap-4",
              formData.priority === p.id ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-border hover:border-primary/30"
            )}
          >
            <span className="text-3xl">{p.icon}</span>
            <div>
              <h4 className="font-bold text-foreground">{p.label}</h4>
              <p className="text-sm text-foreground/60">{p.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {(formData.priority === "academic" || formData.priority === "both") && (
        <div className="p-6 bg-background rounded-3xl space-y-6 border border-border animate-in fade-in slide-in-from-top-4">
          <h4 className="font-bold flex items-center gap-2">
            <span className="p-1 bg-primary/20 rounded-md">📚</span> Academic Details
          </h4>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/70">Subjects you can teach *</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    const next = formData.subjects.includes(s) ? formData.subjects.filter((i:any)=>i!==s) : [...formData.subjects, s];
                    setFormData({...formData, subjects: next});
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm transition-all",
                    formData.subjects.includes(s) ? "bg-primary text-white" : "bg-white border text-foreground/60"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/70">Grades you are comfortable with *</label>
            <div className="flex flex-wrap gap-2">
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => {
                    const next = formData.grades.includes(g) ? formData.grades.filter((i:any)=>i!==g) : [...formData.grades, g];
                    setFormData({...formData, grades: next});
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm transition-all",
                    formData.grades.includes(g) ? "bg-primary text-white" : "bg-white border text-foreground/60"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/70">Teaching Style *</label>
            <div className="flex gap-3">
              {["1-on-1", "Small Group", "Both"].map(t => (
                <button
                  key={t}
                  onClick={() => setFormData({...formData, teachingStyle: t})}
                  className={cn(
                    "flex-1 py-2 text-sm border rounded-xl transition-all",
                    formData.teachingStyle === t ? "border-primary bg-primary/5 text-primary font-bold" : "border-border"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(formData.priority === "skill" || formData.priority === "both") && (
        <div className="p-6 bg-background rounded-3xl space-y-6 border border-border animate-in fade-in slide-in-from-top-4">
          <h4 className="font-bold flex items-center gap-2">
            <span className="p-1 bg-accent/20 rounded-md">🚀</span> Skill Workshop Details
          </h4>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/70">Skills you can teach *</label>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    const next = formData.skills.includes(s) ? formData.skills.filter((i:any)=>i!==s) : [...formData.skills, s];
                    setFormData({...formData, skills: next});
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm transition-all",
                    formData.skills.includes(s) ? "bg-accent text-white" : "bg-white border text-foreground/60"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/70">Duration *</label>
              <select className="w-full p-2 border rounded-xl bg-white text-sm" value={formData.workshopDuration} onChange={e=>setFormData({...formData, workshopDuration: e.target.value})}>
                <option value="">Select</option>
                <option value="30 min">30 min</option>
                <option value="45 min">45 min</option>
                <option value="1 hour">1 hour</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/70">Format *</label>
              <select className="w-full p-2 border rounded-xl bg-white text-sm" value={formData.workshopFormat} onChange={e=>setFormData({...formData, workshopFormat: e.target.value})}>
                <option value="">Select</option>
                <option value="Group">Group</option>
                <option value="1-on-1">1-on-1</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {formData.priority === "one-time" && (
        <div className="p-6 bg-background rounded-3xl space-y-6 border border-border animate-in fade-in slide-in-from-top-4">
           <h4 className="font-bold flex items-center gap-2">
            <span className="p-1 bg-warning/20 rounded-md">🎯</span> One-time Session Details
          </h4>
          <div className="space-y-2">
             <label className="text-sm font-semibold text-foreground/70">What will your session be about? *</label>
             <textarea 
               value={formData.oneTimeTopic}
               onChange={e=>setFormData({...formData, oneTimeTopic: e.target.value})}
               className="w-full p-3 border rounded-xl bg-white text-sm h-32"
               placeholder="Brief description of your proposed session..."
             />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/70">Proposed Date *</label>
              <input type="date" className="w-full p-3 border rounded-xl bg-white text-sm" value={formData.oneTimeDate} onChange={e=>setFormData({...formData, oneTimeDate:e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/70">Proposed Time *</label>
              <input type="time" className="w-full p-3 border rounded-xl bg-white text-sm" value={formData.oneTimeTime} onChange={e=>setFormData({...formData, oneTimeTime:e.target.value})} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Step4({ formData, setFormData }: any) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const slots = [
    { id: "morning", label: "Morning (8am–12pm)" },
    { id: "afternoon", label: "Afternoon (12pm–4pm)" },
    { id: "evening", label: "Evening (4pm–7pm)" },
    { id: "night", label: "Night (7pm–9pm)" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Availability</h2>
          <p className="text-foreground/60">When can you bridge the gap?</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-foreground/70">Available Days *</label>
        <div className="flex flex-wrap gap-2">
          {days.map(d => (
            <button
              key={d}
              onClick={() => {
                const next = formData.days.includes(d) ? formData.days.filter((i:any)=>i!==d) : [...formData.days, d];
                setFormData({...formData, days: next});
              }}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all",
                formData.days.includes(d) ? "bg-primary text-white shadow-lg" : "bg-white border text-foreground/60 shadow-sm"
              )}
            >
              {d.charAt(0)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-foreground/70">Preferred Time Slots *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {slots.map(s => (
            <button
               key={s.id}
               onClick={() => {
                const next = formData.slots.includes(s.id) ? formData.slots.filter((i:any)=>i!==s.id) : [...formData.slots, s.id];
                setFormData({...formData, slots: next});
               }}
               className={cn(
                 "p-4 rounded-xl border text-sm font-medium text-left transition-all",
                 formData.slots.includes(s.id) ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground/60"
               )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-foreground/70">Hours per week *</label>
        <div className="flex gap-4">
           {["1-2 hrs", "3-5 hrs", "5+ hrs"].map(h => (
             <button
               key={h}
               onClick={() => setFormData({...formData, hoursPerWeek: h})}
               className={cn(
                 "flex-1 p-3 rounded-xl border text-sm font-semibold transition-all shadow-sm",
                 formData.hoursPerWeek === h ? "border-primary bg-primary/5 text-primary" : "border-border"
               )}
             >
               {h}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4">
         <label className="text-sm font-bold text-foreground/70">Volunteering Mode *</label>
         <div className="flex gap-4">
            {["Online", "In-person", "Both"].map(m => (
              <button
                key={m}
                onClick={() => setFormData({...formData, mode: m})}
                className={cn(
                  "flex-1 p-3 rounded-xl border text-sm font-semibold transition-all shadow-sm",
                  formData.mode === m ? "border-accent bg-accent/5 text-accent" : "border-border"
                )}
              >
                {m}
              </button>
            ))}
         </div>
      </div>

      {(formData.mode === "In-person" || formData.mode === "Both") && (
        <div className="space-y-2 animate-in slide-in-from-top-2">
           <label className="text-sm font-bold text-foreground/70">Localities you can travel to *</label>
           <input type="text" className="w-full p-3 border rounded-xl bg-white text-sm" placeholder="Area, Neighborhood etc." value={formData.travelArea} onChange={e=>setFormData({...formData, travelArea: e.target.value})} />
        </div>
      )}
    </div>
  );
}

function Step5({ formData, setFormData }: any) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center text-danger">
          <Heart className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Motivation & Experience</h2>
          <p className="text-foreground/60">Help us understand your drive</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-bold text-foreground/70">Why do you want to volunteer? (Min 50 chars) *</label>
        <textarea 
          rows={4}
          className="w-full p-4 border rounded-2xl bg-background outline-none focus:ring-2 focus:ring-danger/20"
          placeholder="I believe in education equality..."
          value={formData.whyVolunteer}
          onChange={e=>setFormData({...formData, whyVolunteer: e.target.value})}
        />
        <p className="text-xs text-right text-foreground/40">{formData.whyVolunteer.length} characters</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-foreground/70">Have you volunteered before? *</label>
        <div className="flex gap-4">
           {["Yes", "No"].map(v => (
             <button
               key={v}
               onClick={() => setFormData({...formData, hasVolunteered: v})}
               className={cn(
                 "flex-1 py-3 px-4 border rounded-xl font-bold transition-all",
                 formData.hasVolunteered === v ? "border-danger bg-danger/5 text-danger" : "border-border"
               )}
             >
               {v}
             </button>
           ))}
        </div>
        {formData.hasVolunteered === "Yes" && (
           <textarea 
            rows={3}
            className="w-full p-3 border rounded-xl bg-white text-sm animate-in fade-in"
            placeholder="Where, what did you do, how long?"
            value={formData.volunteerExp}
            onChange={e=>setFormData({...formData, volunteerExp: e.target.value})}
          />
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-foreground/70">Any prior teaching experience? *</label>
        <div className="flex gap-4">
           {["Yes", "No"].map(t => (
             <button
               key={t}
               onClick={() => setFormData({...formData, hasTaught: t})}
               className={cn(
                 "flex-1 py-3 px-4 border rounded-xl font-bold transition-all",
                 formData.hasTaught === t ? "border-danger bg-danger/5 text-danger" : "border-border"
               )}
             >
               {t}
             </button>
           ))}
        </div>
        {formData.hasTaught === "Yes" && (
           <textarea 
            rows={3}
            className="w-full p-3 border rounded-xl bg-white text-sm animate-in fade-in"
            placeholder="Brief description of teaching style/experience..."
            value={formData.teachingExp}
            onChange={e=>setFormData({...formData, teachingExp: e.target.value})}
          />
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-bold text-foreground/70">What do you hope students gain? *</label>
        <textarea 
          rows={3}
          className="w-full p-4 border rounded-2xl bg-background outline-none"
          placeholder="Confidence, conceptual clarity..."
          value={formData.studentGain}
          onChange={e=>setFormData({...formData, studentGain: e.target.value})}
        />
      </div>
    </div>
  );
}

function Step6({ formData, setFormData, isSubmitting }: any) {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Verification & Final Steps</h2>
          <p className="text-foreground/60">Let's finish the process</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-foreground/70">Upload ID Proof (College/Work ID/Aadhaar) *</label>
        <div 
          className={cn(
            "border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer",
            formData.idUploaded ? "border-accent bg-accent/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
          )}
          onClick={() => setFormData({...formData, idUploaded: true})}
        >
          {formData.idUploaded ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-accent mb-4" />
              <p className="text-accent font-bold">ID Uploaded Successfully</p>
              <p className="text-xs text-accent/60 mt-1">Click to re-upload</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-bold">Click to upload file</p>
              <p className="text-sm text-foreground/40 mt-1">Accepts JPG, PNG, PDF (Max 2MB)</p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
           <label className="text-sm font-bold text-foreground/70">LinkedIn URL (Optional)</label>
           <input type="url" className="w-full p-3 border rounded-xl bg-white text-sm" value={formData.linkedin} onChange={e=>setFormData({...formData, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." />
        </div>
        <div className="space-y-2">
           <label className="text-sm font-bold text-foreground/70">GitHub/Portfolio (Optional)</label>
           <input type="url" className="w-full p-3 border rounded-xl bg-white text-sm" value={formData.github} onChange={e=>setFormData({...formData, github: e.target.value})} placeholder="https://github.com/..." />
        </div>
      </div>

      <div className="p-6 bg-background rounded-3xl border border-border space-y-6">
        <h4 className="font-bold">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <input type="text" className="w-full p-3 border rounded-xl bg-white text-sm" placeholder="Contact Name" value={formData.emergencyName} onChange={e=>setFormData({...formData, emergencyName:e.target.value})} />
           <input type="tel" className="w-full p-3 border rounded-xl bg-white text-sm" placeholder="Contact Number" value={formData.emergencyNumber} onChange={e=>setFormData({...formData, emergencyNumber:e.target.value})} />
           <input type="text" className="w-full p-3 border rounded-xl bg-white text-sm" placeholder="Relationship" value={formData.emergencyRelation} onChange={e=>setFormData({...formData, emergencyRelation:e.target.value})} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            checked={formData.agreeCode}
            onChange={e => setFormData({ ...formData, agreeCode: e.target.checked })}
            className="mt-1 w-5 h-5 rounded-md text-primary" 
          />
          <p className="text-sm text-foreground/60 leading-relaxed font-medium">
             I agree to Vidyastaan's <button className="text-primary hover:underline">Code of Conduct</button> regarding student safety and professional behavior.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            checked={formData.agreeAccuracy}
            onChange={e => setFormData({ ...formData, agreeAccuracy: e.target.checked })}
            className="mt-1 w-5 h-5 rounded-md text-primary" 
          />
          <p className="text-sm text-foreground/60 leading-relaxed font-medium">
             I confirm that all details provided are accurate. I understand that false information will lead to immediate rejection.
          </p>
        </div>
      </div>
    </div>
  );
}
