import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { FiCompass } from "react-icons/fi";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollegeCompass AI",
  description: "A modern, AI-powered college discovery and decision platform for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full pt-16">
            {children}
          </main>
          
          {/* Modern Footer */}
          <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <FiCompass className="text-indigo-600 w-6 h-6" />
                <span className="font-bold text-slate-900">CollegeCompass AI</span>
              </div>
              <p className="text-slate-500 text-sm">© 2026 CollegeCompass Inc. All rights reserved.</p>
              <div className="flex gap-4 text-slate-400">
                <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
