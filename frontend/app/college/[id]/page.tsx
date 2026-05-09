"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiStar, FiDollarSign, FiClock, FiAward, FiArrowLeft, FiCheckCircle, FiUsers, FiBookOpen, FiBookmark, FiX, FiLayers } from "react-icons/fi";
import { useCompareStore } from "@/store/useCompareStore";
import { toast } from "sonner";

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  seats: number;
}

interface Review {
  id: string;
  studentName: string;
  rating: number;
  review: string;
  course: string;
}

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  description: string;
  campusSize: string;
  establishedYear: number;
  accreditation: string;
  imageUrl: string;
  bannerUrl: string;
  placementPercentage: number;
  averagePackage: number;
  highestPackage: number;
  courses: Course[];
  reviews: Review[];
}

export default function CollegeDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const { selectedColleges, addCollege, removeCollege } = useCompareStore();

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/colleges/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCollege(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchCollege();
    }
  }, [params.id]);

  // Check if college is saved
  useEffect(() => {
    const checkSaved = async () => {
      if (!session) return;
      try {
        const res = await fetch("/api/saved");
        if (res.ok) {
          const data = await res.json();
          setIsSaved(data.some((c: any) => c.id === params.id));
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkSaved();
  }, [session, params.id]);

  const handleSave = async () => {
    if (!session) {
      toast.error("Please log in to save colleges");
      router.push("/login");
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        const res = await fetch("/api/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId: params.id }),
        });
        if (res.ok) {
          setIsSaved(false);
          toast.success("College removed from saved");
        }
      } else {
        const res = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId: params.id }),
        });
        if (res.ok) {
          setIsSaved(true);
          toast.success("College saved successfully!");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompare = () => {
    if (!college) return;
    const isSelected = selectedColleges.includes(college.id);
    if (isSelected) {
      removeCollege(college.id);
      toast.info("Removed from compare");
    } else {
      if (selectedColleges.length >= 3) {
        toast.error("You can compare up to 3 colleges");
        return;
      }
      addCollege(college.id);
      toast.success("Added to compare");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="text-center py-32 text-slate-500 bg-slate-50 min-h-screen">
        <p className="text-2xl font-bold mb-4">College not found</p>
        <Link href="/colleges" className="text-indigo-600 hover:underline">Return to listings</Link>
      </div>
    );
  }

  const isComparing = selectedColleges.includes(college.id);
  const tabs = ['overview', 'courses', 'placements', 'reviews'];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner Section */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <img src={college.bannerUrl} alt="Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <Link href="/colleges" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium">
              <FiArrowLeft className="mr-2" /> Back to Search
            </Link>
            <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center p-1 border-4 border-white/20">
                  <img src={college.imageUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">{college.name}</h1>
                  <div className="flex flex-wrap items-center text-white/80 gap-4 font-medium">
                    <span className="flex items-center"><FiMapPin className="mr-1.5" /> {college.location}</span>
                    <span className="flex items-center text-yellow-400"><FiStar className="mr-1.5 fill-current" /> {college.rating} Rating</span>
                    <span className="flex items-center text-green-400"><FiCheckCircle className="mr-1.5" /> {college.accreditation}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCompare}
                  className={`px-5 py-3 backdrop-blur-md border rounded-xl font-bold transition-colors flex items-center shadow-lg ${
                    isComparing
                      ? "bg-indigo-500/30 border-indigo-400/50 text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <FiLayers className="mr-2" /> {isComparing ? "In Compare" : "Compare"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-6 py-3 backdrop-blur-md border rounded-xl font-bold transition-colors flex items-center shadow-lg disabled:opacity-50 ${
                    isSaved
                      ? "bg-indigo-500/30 border-indigo-400/50 text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <FiBookmark className={`mr-2 ${isSaved ? "fill-current" : ""}`} />
                  {isSaving ? "..." : isSaved ? "Saved" : "Save"}
                </button>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Animated Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar relative">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-bold text-sm capitalize whitespace-nowrap transition-colors relative z-10 ${
                activeTab === tab ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {activeTab === 'overview' && (
                  <>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                        <FiBookOpen className="mr-2 text-indigo-600" /> About the Institution
                      </h2>
                      <p className="text-slate-600 leading-relaxed text-lg">{college.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatCard icon={<FiDollarSign />} label="Avg Fees/Year" value={`₹${(college.fees/100000).toFixed(1)}L`} />
                      <StatCard icon={<FiUsers />} label="Campus Size" value={college.campusSize} />
                      <StatCard icon={<FiAward />} label="Established" value={college.establishedYear.toString()} />
                    </div>
                  </>
                )}

                {activeTab === 'courses' && (
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                      <h2 className="text-xl font-bold text-slate-900">Programs Offered</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {college.courses.map((course) => (
                        <div key={course.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{course.name}</h3>
                            <div className="flex flex-wrap items-center text-slate-500 gap-4 text-sm font-medium">
                              <span className="flex items-center bg-white border border-slate-200 px-3 py-1 rounded-full"><FiClock className="mr-1.5 text-slate-400" /> {course.duration}</span>
                              <span className="flex items-center bg-white border border-slate-200 px-3 py-1 rounded-full"><FiUsers className="mr-1.5 text-slate-400" /> {course.seats} Seats</span>
                            </div>
                          </div>
                          <div className="text-left md:text-right">
                            <div className="text-sm text-slate-500 mb-1 font-medium">Annual Fees</div>
                            <div className="text-xl font-extrabold text-indigo-600">₹{course.fees.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'placements' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200">
                        <div className="text-indigo-100 mb-1 font-medium">Placement Rate</div>
                        <div className="text-4xl font-extrabold">{college.placementPercentage}%</div>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-slate-500 mb-1 font-medium">Highest Package</div>
                        <div className="text-3xl font-extrabold text-slate-900">{college.highestPackage} <span className="text-lg text-slate-400">LPA</span></div>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-slate-500 mb-1 font-medium">Average Package</div>
                        <div className="text-3xl font-extrabold text-slate-900">{college.averagePackage} <span className="text-lg text-slate-400">LPA</span></div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Placement Distribution</h3>
                      <div className="space-y-4">
                        <ProgressBar label="Top IT & Software" percentage={65} color="bg-indigo-500" />
                        <ProgressBar label="Consulting & Analytics" percentage={20} color="bg-purple-500" />
                        <ProgressBar label="Core Engineering" percentage={15} color="bg-cyan-500" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {college.reviews.map((review) => (
                      <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                              {review.studentName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{review.studentName}</div>
                              <div className="text-xs text-slate-500 font-medium">{review.course}</div>
                            </div>
                          </div>
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                            <FiStar className="text-yellow-500 fill-current mr-1" />
                            <span className="font-bold text-yellow-700">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed italic">"{review.review}"</p>
                      </div>
                    ))}
                    {!college.reviews.length && <p className="text-slate-500 py-4">No reviews yet.</p>}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <FiAward className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Admission Guidance</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">Connect with verified alumni or expert counselors to crack the admission process.</p>
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold transition-colors shadow-lg"
              >
                Book Free Session
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Why {college.name.split(' ')[0]}?</h3>
              <ul className="space-y-3">
                <li className="flex items-start"><FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" /> <span className="text-slate-600 text-sm">Top 10 ranked in state</span></li>
                <li className="flex items-start"><FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" /> <span className="text-slate-600 text-sm">Strong alumni network</span></li>
                <li className="flex items-start"><FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" /> <span className="text-slate-600 text-sm">Excellent research facilities</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Now Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-bold text-slate-900">Apply to {college.name}</h3>
                <button onClick={() => setShowApplyModal(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={session?.user?.name || ""}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={session?.user?.email || ""}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Preferred Course</label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                    {college.courses.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Message (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    placeholder="Any additional information..."
                  ></textarea>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="text-sm text-slate-500">
                  Contact: <span className="font-medium text-slate-700">admissions@{college.name.split(' ')[0].toLowerCase()}.edu</span>
                </div>
                <button
                  onClick={() => {
                    setShowApplyModal(false);
                    toast.success("Application submitted! We'll get back to you soon.");
                  }}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Submit Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="text-xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  )
}

function ProgressBar({ label, percentage, color }: { label: string, percentage: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-900">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2.5 rounded-full ${color}`} 
        />
      </div>
    </div>
  )
}
