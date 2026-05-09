"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiSearch, FiCheckCircle } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/colleges?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 pt-20 pb-32">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-200/50 blur-[100px]" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-200/50 blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] rounded-full bg-cyan-100/50 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6 shadow-sm">
              ✨ Introducing CollegeCompass AI Predictor
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Find Your Perfect College <br className="hidden md:block" />
              with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI-Powered Insights</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop guessing. Discover, compare, and predict your admission chances at top-tier institutions using smart data and real placement records.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-32 py-5 rounded-2xl border-2 border-transparent bg-white shadow-xl shadow-indigo-100/50 text-lg placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-0 transition-all"
                placeholder="Search colleges or courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 flex items-center px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Search
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to decide</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">We provide the data, you make the choice. A complete toolkit for your career path.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              title="Smart Discovery" 
              desc="Filter through hundreds of colleges by fees, location, and verified placement stats."
              delay={0.1}
            />
            <FeatureCard 
              title="Deep Comparison" 
              desc="Side-by-side analysis of up to 3 colleges to see exactly what you're paying for."
              delay={0.2}
            />
            <FeatureCard 
              title="AI Admission Predictor" 
              desc="Enter your exam rank and let our algorithm match you with the best possibilities."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to find your future?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join thousands of students making data-driven decisions about their education.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/colleges" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              Explore Colleges <FiArrowRight className="ml-2" />
            </Link>
            <Link href="/predictor" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-lg transition-colors flex items-center justify-center backdrop-blur-sm">
              Try AI Predictor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, delay }: { title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group"
    >
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
        <FiCheckCircle className="text-indigo-600 w-6 h-6" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}