"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMapPin, FiStar, FiFilter, FiTrendingUp, FiCheckSquare, FiSquare, FiBookmark, FiHeart } from "react-icons/fi";
import { useCompareStore } from "@/store/useCompareStore";
import { toast } from "sonner";

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  imageUrl: string;
  courses?: { name: string }[];
}

export default function CollegeListingPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <CollegeListing />
    </Suspense>
  );
}

function CollegeListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  
  // Filters
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const { selectedColleges, addCollege, removeCollege } = useCompareStore();

  // Fetch saved colleges list
  useEffect(() => {
    const fetchSaved = async () => {
      if (!session) return;
      try {
        const res = await fetch("/api/saved");
        if (res.ok) {
          const data = await res.json();
          setSavedIds(new Set(data.map((c: any) => c.id)));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSaved();
  }, [session]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("q", search);
      if (location) query.append("location", location);
      if (maxFees) query.append("maxFees", maxFees);
      if (minRating) query.append("minRating", minRating);
      if (sortBy) query.append("sortBy", sortBy);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/colleges?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setColleges(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColleges();
    }, 400); // Debounce
    return () => clearTimeout(timer);
  }, [search, location, maxFees, minRating, sortBy]);

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedColleges.includes(id)) {
      removeCollege(id);
      toast.info("Removed from compare");
    } else {
      if (selectedColleges.length >= 3) {
        toast.error("You can compare up to 3 colleges");
        return;
      }
      addCollege(id);
      toast.success("Added to compare");
    }
  };

  const handleSave = async (collegeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to save colleges");
      router.push("/login");
      return;
    }

    const isSaved = savedIds.has(collegeId);
    try {
      if (isSaved) {
        const res = await fetch("/api/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
        });
        if (res.ok) {
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(collegeId);
            return next;
          });
          toast.success("Removed from saved");
        }
      } else {
        const res = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
        });
        if (res.ok) {
          setSavedIds((prev) => new Set(prev).add(collegeId));
          toast.success("College saved!");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">Discover Top Colleges</h1>
          <p className="text-slate-300 text-lg">Filter through verified data and real placement statistics.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 sticky top-24">
              <div className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-6 pb-4 border-b border-slate-100">
                <FiFilter /> Filters
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Search</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. IIT, BITS"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="City..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Max Fees (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={maxFees}
                    onChange={(e) => setMaxFees(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Min Rating</label>
                  <input
                    type="range"
                    min="1" max="5" step="0.5"
                    value={minRating || "1"}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full accent-indigo-600"
                  />
                  <div className="text-xs text-slate-500 mt-1 text-right">{minRating || "Any"} Stars</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            
            {/* Sorting & Compare Bar */}
            <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 font-medium">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="placements">Best Placements</option>
                  <option value="fees">Lowest Fees</option>
                </select>
              </div>
              
              {selectedColleges.length > 0 && (
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {selectedColleges.length}/3 Selected
                  </span>
                  <Link href="/compare" className="text-sm font-bold bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    Compare Now
                  </Link>
                </div>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(n => (
                  <div key={n} className="bg-white h-[400px] rounded-2xl border border-slate-100 animate-pulse flex flex-col">
                    <div className="h-48 bg-slate-200 rounded-t-2xl" />
                    <div className="p-6 flex-1 space-y-4">
                      <div className="h-6 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="grid grid-cols-2 gap-4 pt-4">
                         <div className="h-10 bg-slate-200 rounded" />
                         <div className="h-10 bg-slate-200 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : colleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {colleges.map((college) => {
                    const isSelected = selectedColleges.includes(college.id);
                    const isSaved = savedIds.has(college.id);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={college.id}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-xl font-bold line-clamp-1">{college.name}</h3>
                            <div className="flex items-center text-sm text-slate-300 mt-1">
                              <FiMapPin className="mr-1" /> {college.location}
                            </div>
                          </div>
                          {/* Top-right action buttons */}
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button 
                              onClick={(e) => handleSave(college.id, e)}
                              className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
                                isSaved
                                  ? "bg-indigo-500/80 text-white"
                                  : "bg-white/20 text-white hover:bg-white hover:text-indigo-600"
                              }`}
                              title={isSaved ? "Unsave" : "Save College"}
                            >
                              <FiBookmark size={18} className={isSaved ? "fill-current" : ""} />
                            </button>
                            <button 
                              onClick={(e) => toggleCompare(college.id, e)}
                              className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
                                isSelected
                                  ? "bg-indigo-500/80 text-white"
                                  : "bg-white/20 text-white hover:bg-white hover:text-indigo-600"
                              }`}
                              title="Add to Compare"
                            >
                              {isSelected ? <FiCheckSquare size={18} /> : <FiSquare size={18} />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-sm font-bold border border-yellow-100">
                              <FiStar className="mr-1 fill-current" /> {college.rating}
                            </div>
                            <div className="flex items-center text-green-600 text-sm font-bold">
                              <FiTrendingUp className="mr-1" /> {college.placementPercentage}% Placed
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <div className="text-xs text-slate-500 font-medium">Avg Fees/Yr</div>
                              <div className="font-bold text-slate-900">₹{(college.fees / 100000).toFixed(1)}L</div>
                            </div>
                            {college.courses && college.courses.length > 0 && (
                              <div>
                                <div className="text-xs text-slate-500 font-medium">Top Course</div>
                                <div className="font-semibold text-slate-700 text-sm line-clamp-1">{college.courses[0].name}</div>
                              </div>
                            )}
                          </div>

                          <div className="mt-auto pt-4 border-t border-slate-50">
                            <Link 
                              href={`/college/${college.id}`}
                              className="block w-full text-center py-3 bg-slate-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500">
                <FiSearch className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">No matches found</h3>
                <p>Try adjusting your filters to see more colleges.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
