"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Mic, MicOff, StopCircle, RefreshCcw, 
  MessageSquare, User, Bot, Loader2, Sparkles, Languages
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { getStudentProfile } from "@/lib/db";
import { aiStudyBuddyChat } from "@/lib/claude";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function AIStudyBuddyPage() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your Vidyastaan AI Study Buddy. I can help you understand complex topics simply. What are we learning today? 😊",
      sender: "bot",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    getStudentProfile(user.uid).then(setStudentData).catch(console.error);
  }, [user]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await aiStudyBuddyChat(
        text, 
        studentData?.grade || "10", 
        studentData?.language || "English/Hindi"
      );
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("AI error:", error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsTyping(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Mock voice to text for demo
      handleSend("Explain how photosynthesis works");
    } else {
      setIsRecording(true);
      toast.success("Voice input active. Speak now...");
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[2.5rem] border border-border shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
               <Bot className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-xl font-bold">AI Study Buddy</h1>
               <div className="flex items-center gap-2 text-xs font-bold text-accent">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  Ready to Help
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-xl text-sm font-semibold text-foreground/60">
               <Languages className="w-4 h-4 text-primary" />
               Speaking: {studentData?.language || "English/Hindi"}
            </div>
            <button 
              onClick={() => setMessages([messages[0]])}
              className="p-3 hover:bg-background rounded-xl transition-all" 
              title="Clear Chat"
            >
               <RefreshCcw className="w-5 h-5 text-foreground/40" />
            </button>
         </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 px-4 pb-10 scrollbar-hide"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={cn(
              "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.sender === "user" ? "flex-row-reverse" : ""
            )}
          >
            <div className={cn(
               "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
               msg.sender === "user" ? "bg-primary text-white" : "bg-white border border-border text-indigo-500"
            )}>
               {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={cn(
               "max-w-[80%] p-5 rounded-3xl text-sm font-medium leading-relaxed tracking-wide shadow-sm whitespace-pre-wrap",
               msg.sender === "user" 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-white border border-border text-foreground rounded-tl-none"
            )}>
               {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-indigo-500">
                 <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-border p-5 rounded-3xl rounded-tl-none">
                 <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-500/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-indigo-500/20 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 bg-indigo-500/20 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-6 p-6 bg-white rounded-[2.5rem] border border-border shadow-xl shadow-primary/5">
         <div className="flex items-center gap-4">
            <button 
              onClick={toggleRecording}
              className={cn(
                "p-4 rounded-2xl transition-all shadow-lg flex items-center justify-center shrink-0",
                isRecording 
                  ? "bg-danger text-white animate-pulse" 
                  : "bg-primary/5 text-primary hover:bg-primary/10"
              )}
            >
               {isRecording ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <div className="flex-1 relative">
               <input 
                 type="text"
                 placeholder="Ask me anything..."
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                 className="w-full pl-6 pr-14 py-4 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none font-medium"
               />
               <button 
                 onClick={() => handleSend(input)}
                 disabled={!input.trim() || isTyping}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-primary disabled:opacity-30 transition-opacity"
               >
                 {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
               </button>
            </div>
         </div>
         <div className="flex flex-wrap gap-2 mt-4">
            {["Explain Gravity", "Who is APJ Abdul Kalam?", "Math help", "Translate to Hindi"].map(tag => (
               <button 
                 key={tag}
                 onClick={() => handleSend(tag)}
                 disabled={isTyping}
                 className="px-4 py-1.5 border border-border rounded-full text-xs font-bold text-foreground/40 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-2 disabled:opacity-50"
               >
                 <Sparkles className="w-3 h-3" />
                 {tag}
               </button>
            ))}
         </div>
      </div>
    </div>
  );
}

