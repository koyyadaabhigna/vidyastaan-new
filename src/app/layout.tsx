import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vidyastaan — a new possibility for every child",
  description: "Vidyastaan is India's peer-to-peer learning and skill exchange platform connecting underserved school students with college volunteers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-background text-foreground mesh-gradient">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              className: 'glass border-none shadow-2xl rounded-2xl font-bold',
            }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}
