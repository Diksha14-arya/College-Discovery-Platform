"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX, FiCheckCircle, FiTrash2, FiSearch, FiStar } from "react-icons/fi";
import { useCompareStore } from "@/store/useCompareStore";
import { toast } from "sonner";

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  averagePackage: number;
  highestPackage: number;
  campusSize: string;
  courses?: { name: string }[];
}

export default function Compare() {
  const { selectedColleges, removeCollege, clearColleges, addCollege } = useCompareStore();
  const [compareData, setCompareData] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search state for modal
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedColleges.length === 0) {
      setCompareData([]);
      return;
    }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/colleges/compare?ids=${selectedColleges.join(",")}`)
      .then((res) => res.json())
      .then((data) => setCompareData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedColleges]);

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/colleges?q=${searchQuery}&limit=10`)
          .then(res => res.json())
          .then(data => setSearchResults(data.data))
          .catch(console.error);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, isModalOpen]);

  const handleRemove = (id: string) => {
    removeCollege(id);
    toast.info("College removed from comparison");
  };

  const handleClear = () => {
    clearColleges();
    toast.info("Comparison cleared");
  };

  const handleAdd = (id: string) => {
    addCollege(id);
    toast.success("College added to comparison");
  };

  // Utility to find the "best" value in a row to highlight it
  const getBestInRow = (field: keyof College, type: 'high' | 'low') => {
    if (compareData.length < 2) return null;
    let bestVal = compareData[0][field] as number;
    compareData.forEach(c => {
      const val = c[field] as number;
      if (type === 'high' && val > bestVal) bestVal = val;
      if (type === 'low' && val < bestVal) bestVal = val;
    });
    return bestVal;
  };

  const bestFees = getBestInRow('fees', 'low');
  const bestRating = getBestInRow('rating', 'high');
  const bestPlacement = getBestInRow('placementPercentage', 'high');
  const bestAvgPack = getBestInRow('averagePackage', 'high');

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">Compare Engine</h1>
          <p className="text-slate-300 text-lg">Side-by-side analysis. We highlight the best metrics for you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        {selectedColleges.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <FiPlus size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Add Colleges to Compare</h2>
            <p className="text-slate-500 mb-8 text-lg">Select up to 3 institutions from the discovery page or search below to start your analysis.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
            >
              Search & Add Colleges
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="text-slate-700 font-bold text-lg">Comparing {selectedColleges.length} of 3 Institutions</div>
              <div className="flex gap-4">
                <button 
                  onClick={handleClear}
                  className="px-4 py-2 text-slate-500 hover:text-red-500 font-medium transition-colors text-sm flex items-center"
                >
                  <FiTrash2 className="mr-2" /> Clear All
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  disabled={selectedColleges.length >= 3}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center shadow-sm"
                >
                  <FiPlus className="mr-2" /> Add More
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr>
                        <th className="p-8 bg-slate-50/50 font-bold text-slate-500 w-1/4 border-b border-slate-100 uppercase tracking-wider text-sm">
                          Metrics
                        </th>
                        {compareData.map(c => (
                          <th key={c.id} className="p-8 border-l border-b border-slate-100 w-1/4 align-top relative group bg-white">
                            <button 
                              onClick={() => handleRemove(c.id)}
                              className="absolute top-6 right-6 w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                              title="Remove"
                            >
                              <FiX size={16} />
                            </button>
                            <h3 className="font-extrabold text-xl text-slate-900 leading-tight mb-4 pr-8">{c.name}</h3>
                            <Link href={`/college/${c.id}`} className="text-sm text-indigo-600 font-bold hover:underline">Full Profile &rarr;</Link>
                          </th>
                        ))}
                        {Array.from({ length: 3 - compareData.length }).map((_, i) => (
                          <th key={`empty-${i}`} className="p-8 border-l border-b border-slate-100 w-1/4 bg-slate-50/50 align-middle">
                            <button 
                              onClick={() => setIsModalOpen(true)}
                              className="w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                            >
                              <FiPlus size={24} className="mb-2" />
                              <span className="text-sm font-bold">Add College</span>
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      
                      {/* Fees */}
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 font-bold text-slate-900 bg-slate-50/30">Total Fees / Yr</td>
                        {compareData.map(c => (
                          <td key={`fee-${c.id}`} className={`p-6 border-l border-slate-100 ${c.fees === bestFees ? 'bg-green-50/30' : ''}`}>
                            <div className="font-extrabold text-lg">₹{c.fees.toLocaleString()}</div>
                            {c.fees === bestFees && compareData.length > 1 && <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Lowest Fees</span>}
                          </td>
                        ))}
                        {Array.from({ length: 3 - compareData.length }).map((_, i) => <td key={`e1-${i}`} className="p-6 border-l border-slate-100"></td>)}
                      </tr>

                      {/* Rating */}
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 font-bold text-slate-900 bg-slate-50/30">Overall Rating</td>
                        {compareData.map(c => (
                          <td key={`rate-${c.id}`} className={`p-6 border-l border-slate-100 ${c.rating === bestRating ? 'bg-green-50/30' : ''}`}>
                            <div className="flex items-center text-lg font-extrabold">
                              {c.rating} <FiStar className="ml-1.5 text-yellow-500 fill-current" />
                            </div>
                            {c.rating === bestRating && compareData.length > 1 && <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Highest Rated</span>}
                          </td>
                        ))}
                        {Array.from({ length: 3 - compareData.length }).map((_, i) => <td key={`e2-${i}`} className="p-6 border-l border-slate-100"></td>)}
                      </tr>

                      {/* Placement Rate */}
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 font-bold text-slate-900 bg-slate-50/30">Placement Rate</td>
                        {compareData.map(c => (
                          <td key={`pr-${c.id}`} className={`p-6 border-l border-slate-100 ${c.placementPercentage === bestPlacement ? 'bg-green-50/30' : ''}`}>
                            <div className="font-extrabold text-lg flex items-center">
                              {c.placementPercentage}% 
                            </div>
                            {c.placementPercentage === bestPlacement && compareData.length > 1 && <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Best Placement</span>}
                          </td>
                        ))}
                        {Array.from({ length: 3 - compareData.length }).map((_, i) => <td key={`e3-${i}`} className="p-6 border-l border-slate-100"></td>)}
                      </tr>

                      {/* Avg Package */}
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 font-bold text-slate-900 bg-slate-50/30">Avg Package</td>
                        {compareData.map(c => (
                          <td key={`ap-${c.id}`} className={`p-6 border-l border-slate-100 ${c.averagePackage === bestAvgPack ? 'bg-indigo-50/30' : ''}`}>
                            <div className={`font-extrabold text-lg ${c.averagePackage === bestAvgPack ? 'text-indigo-700' : ''}`}>
                              {c.averagePackage} LPA
                            </div>
                          </td>
                        ))}
                        {Array.from({ length: 3 - compareData.length }).map((_, i) => <td key={`e4-${i}`} className="p-6 border-l border-slate-100"></td>)}
                      </tr>

                      {/* Location */}
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 font-bold text-slate-900 bg-slate-50/30">Location</td>
                        {compareData.map(c => (
                          <td key={`loc-${c.id}`} className="p-6 border-l border-slate-100 font-medium">
                            {c.location}
                          </td>
                        ))}
                        {Array.from({ length: 3 - compareData.length }).map((_, i) => <td key={`e5-${i}`} className="p-6 border-l border-slate-100"></td>)}
                      </tr>

                      {/* Campus Size */}
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 font-bold text-slate-900 bg-slate-50/30">Campus Size</td>
                        {compareData.map(c => (
                          <td key={`camp-${c.id}`} className="p-6 border-l border-slate-100 text-slate-600">
                            {c.campusSize}
                          </td>
                        ))}
                        {Array.from({ length: 3 - compareData.length }).map((_, i) => <td key={`e6-${i}`} className="p-6 border-l border-slate-100"></td>)}
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modern Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-bold text-slate-900">Add College</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="p-6 border-b border-slate-100">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by college name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-6 bg-slate-50/50">
                <div className="grid grid-cols-1 gap-3">
                  {searchResults.map(c => {
                    const isSelected = selectedColleges.includes(c.id);
                    const isDisabled = !isSelected && selectedColleges.length >= 3;
                    return (
                      <div 
                        key={c.id} 
                        onClick={() => {
                          if (isDisabled) return;
                          if (isSelected) {
                            removeCollege(c.id);
                            toast.info("Removed from compare");
                          } else {
                            handleAdd(c.id);
                          }
                        }}
                        className={`p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : isDisabled 
                              ? 'border-slate-100 opacity-50 cursor-not-allowed bg-white' 
                              : 'border-slate-100 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900 mb-1">{c.name}</div>
                          <div className="text-sm font-medium text-slate-500">{c.location} • {c.rating}★</div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isSelected ? <FiCheckCircle size={18} /> : <FiPlus size={18} />}
                        </div>
                      </div>
                    )
                  })}
                  {searchResults.length === 0 && (
                    <div className="text-center py-10 text-slate-500 font-medium">Type to search for colleges.</div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
                <span className="font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">{selectedColleges.length}/3 Selected</span>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
