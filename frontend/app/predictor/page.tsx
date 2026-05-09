"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu, FiMapPin, FiTarget, FiArrowRight, FiCheckCircle, FiBookmark, FiLayers } from "react-icons/fi";
import Link from "next/link";
import { useCompareStore } from "@/store/useCompareStore";
import { toast } from "sonner";

interface MatchResult {
  college: {
    id: string;
    name: string;
    location: string;
    rating: number;
    fees: number;
    imageUrl: string;
  };
  matchScore: number;
  chance: 'High' | 'Medium' | 'Low';
}

export default function Predictor() {
  const { data: session } = useSession();
  const router = useRouter();
  const { selectedColleges, addCollege, removeCollege } = useCompareStore();

  const [exam, setExam] = useState("JEE");
  const [rank, setRank] = useState("");
  const [location, setLocation] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank) return;
    
    setLoading(true);
    setResults(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/predictor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam, rank: parseInt(rank), location, course })
      });
      const data = await res.json();
      
      // Artificial delay for "AI processing" effect
      setTimeout(() => {
        setResults(data);
        setLoading(false);
        toast.success(`Found ${data.length} matching colleges!`);
      }, 1500);
      
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Failed to get predictions. Make sure the backend is running.");
    }
  };

  const handleSave = async (collegeId: string) => {
    if (!session) {
      toast.error("Please log in to save colleges");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      if (res.ok) {
        toast.success("College saved!");
      } else {
        const data = await res.json();
        toast.info(data.message || "Already saved");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleCompare = (collegeId: string) => {
    if (selectedColleges.includes(collegeId)) {
      removeCollege(collegeId);
      toast.info("Removed from compare");
    } else {
      if (selectedColleges.length >= 3) {
        toast.error("You can compare up to 3 colleges");
        return;
      }
      addCollege(collegeId);
      toast.success("Added to compare");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 pt-16 pb-32 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20">
            <FiCpu className="text-indigo-400 w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AI Admission Predictor
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Input your competitive exam details and let our algorithm match you with your most statistically probable college destinations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Predictor Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Enter Your Profile</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Exam Type</label>
                  <select 
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="JEE">JEE Main</option>
                    <option value="JEE_ADV">JEE Advanced</option>
                    <option value="NEET">NEET</option>
                    <option value="CUET">CUET</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">All India Rank</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Preferred Location (Optional)</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-3.5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="e.g. Delhi, Mumbai"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Preferred Course (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading || !rank}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-600/30 flex justify-center items-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analyzing Data...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Generate Matches <FiArrowRight className="ml-2" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2">
            {!results && !loading ? (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                  <FiTarget className="text-indigo-400 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Awaiting Input</h3>
                <p className="text-slate-500 max-w-sm">Enter your exam rank and preferences to see your statistically matched colleges.</p>
              </div>
            ) : null}

            {/* Loading state */}
            {loading && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
                <div className="w-16 h-16 mx-auto mb-6 relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing your profile...</h3>
                <p className="text-slate-500">Running AI matching algorithms</p>
              </div>
            )}

            <AnimatePresence>
              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap justify-between items-center bg-indigo-50 p-6 rounded-2xl border border-indigo-100 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-indigo-900">Your Top Matches</h2>
                      <p className="text-indigo-700 text-sm">Based on {exam} Rank {rank}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-indigo-600 font-bold bg-white px-4 py-2 rounded-xl shadow-sm">
                        {results.length} Results
                      </div>
                      {selectedColleges.length > 0 && (
                        <Link
                          href="/compare"
                          className="text-sm font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          Compare ({selectedColleges.length})
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {results.map((result, idx) => {
                      const isComparing = selectedColleges.includes(result.college.id);
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={result.college.id} 
                          className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 border border-slate-100 transition-all flex flex-col sm:flex-row gap-6 items-center group"
                        >
                          <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden shrink-0 relative">
                            <img src={result.college.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={result.college.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                          </div>
                          
                          <div className="flex-1 w-full">
                            <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{result.college.name}</h3>
                            <div className="flex items-center text-slate-500 text-sm mb-4 font-medium">
                              <FiMapPin className="mr-1" /> {result.college.location}
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Match Score</div>
                                <div className="flex items-center">
                                  <div className="w-full bg-slate-100 rounded-full h-2 min-w-[100px] mr-3">
                                    <div className={`h-2 rounded-full ${result.matchScore > 80 ? 'bg-green-500' : result.matchScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${result.matchScore}%` }}></div>
                                  </div>
                                  <span className="font-bold text-slate-900">{result.matchScore}%</span>
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Chance</div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  result.chance === 'High' ? 'bg-green-100 text-green-700' :
                                  result.chance === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {result.chance}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col gap-2">
                            <Link href={`/college/${result.college.id}`} className="px-6 py-3 bg-slate-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors border border-indigo-100 text-center">
                              View Details
                            </Link>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSave(result.college.id)}
                                className="flex-1 px-3 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
                              >
                                <FiBookmark className="w-3.5 h-3.5" /> Save
                              </button>
                              <button
                                onClick={() => handleCompare(result.college.id)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1 ${
                                  isComparing
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                              >
                                <FiLayers className="w-3.5 h-3.5" /> {isComparing ? "Added" : "Compare"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    {results.length === 0 && (
                      <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
                        <h3 className="text-lg font-bold text-slate-900">No matches found</h3>
                        <p className="text-slate-500">Your rank might be too high for the specified filters. Try removing location/course filters.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
