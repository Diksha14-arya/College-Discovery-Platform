"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiBookmark, FiTrash2, FiMapPin, FiStar, FiLayers, FiSearch } from "react-icons/fi";
import { useCompareStore } from "@/store/useCompareStore";
import { toast } from "sonner";

interface SavedCollege {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  rating: number;
  fees: number;
  placementPercentage: number;
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedColleges, addCollege, removeCollege } = useCompareStore();

  const fetchSaved = async () => {
    try {
      const res = await fetch("/api/saved");
      if (res.ok) {
        const data = await res.json();
        setSavedColleges(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchSaved();
    else setLoading(false);
  }, [session]);

  const handleRemove = async (collegeId: string) => {
    try {
      const res = await fetch("/api/saved", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      if (res.ok) {
        setSavedColleges((prev) => prev.filter((c) => c.id !== collegeId));
        toast.success("College removed from saved");
      }
    } catch (err) {
      toast.error("Failed to remove college");
    }
  };

  const toggleCompare = (id: string) => {
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        <div className="bg-slate-900 pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-extrabold mb-4">Saved Colleges</h1>
          <p className="text-slate-300 text-lg">Your curated list of dream institutions.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white h-[300px] rounded-2xl border border-slate-100 animate-pulse">
                <div className="h-40 bg-slate-200 rounded-t-2xl" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-slate-900 pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">Saved Colleges</h1>
          <p className="text-slate-300 text-lg">Your curated list of dream institutions.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        {/* Compare bar */}
        {selectedColleges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-wrap items-center justify-between gap-4"
          >
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {selectedColleges.length}/3 Selected for Compare
            </span>
            <Link
              href="/compare"
              className="text-sm font-bold bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Compare Now
            </Link>
          </motion.div>
        )}

        {savedColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {savedColleges.map((college) => {
                const isComparing = selectedColleges.includes(college.id);
                return (
                  <motion.div
                    key={college.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={college.imageUrl}
                        alt={college.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-lg font-bold line-clamp-1">{college.name}</h3>
                        <div className="flex items-center text-sm text-slate-300 mt-0.5">
                          <FiMapPin className="mr-1" /> {college.location}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-sm font-bold border border-yellow-100">
                          <FiStar className="mr-1 fill-current" /> {college.rating}
                        </div>
                        <div className="text-sm font-bold text-slate-700">
                          ₹{(college.fees / 100000).toFixed(1)}L/yr
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-slate-50">
                        <Link
                          href={`/college/${college.id}`}
                          className="col-span-1 text-center py-2 bg-slate-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => toggleCompare(college.id)}
                          className={`col-span-1 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1 ${
                            isComparing
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                          }`}
                        >
                          <FiLayers className="w-3.5 h-3.5" />
                          {isComparing ? "In List" : "Compare"}
                        </button>
                        <button
                          onClick={() => handleRemove(college.id)}
                          className="col-span-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBookmark className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No Saved Colleges</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Start exploring colleges and save the ones you're interested in. They'll appear here for quick access.
            </p>
            <Link
              href="/colleges"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
            >
              <FiSearch className="w-4 h-4" /> Discover Colleges
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
