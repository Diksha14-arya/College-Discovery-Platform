"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiUser, FiMail, FiBookmark, FiLayers, FiLogOut, FiArrowRight, FiCalendar, FiShield } from "react-icons/fi";
import { useStore } from "@/store/useStore";
import { useCompareStore } from "@/store/useCompareStore";

interface SavedCollege {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  rating: number;
  fees: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedColleges } = useCompareStore();

  useEffect(() => {
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
    if (session) fetchSaved();
    else setLoading(false);
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  const user = session.user;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 pt-16 pb-32 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] translate-y-1/2" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-4xl font-bold shadow-2xl">
            {initials}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold mb-2">{user?.name || "User"}</h1>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-indigo-100">
              <span className="flex items-center gap-1.5"><FiMail className="w-4 h-4" /> {user?.email}</span>
              <span className="flex items-center gap-1.5"><FiCalendar className="w-4 h-4" /> Joined 2026</span>
              <span className="flex items-center gap-1.5"><FiShield className="w-4 h-4" /> Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <FiBookmark className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{savedColleges.length}</div>
                <div className="text-sm text-slate-500 font-medium">Saved Colleges</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <FiLayers className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{selectedColleges.length}</div>
                <div className="text-sm text-slate-500 font-medium">In Compare</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <FiUser className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">Active</div>
                <div className="text-sm text-slate-500 font-medium">Account Status</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Saved Colleges Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Saved Colleges</h2>
            <Link href="/saved" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : savedColleges.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {savedColleges.slice(0, 5).map((college) => (
                <Link
                  key={college.id}
                  href={`/college/${college.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{college.name}</div>
                    <div className="text-sm text-slate-500">{college.location}</div>
                  </div>
                  <div className="text-sm font-bold text-indigo-600 shrink-0">
                    ★ {college.rating}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <FiBookmark className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="font-medium">No saved colleges yet</p>
              <Link href="/colleges" className="text-indigo-600 text-sm font-medium hover:underline mt-2 inline-block">
                Discover colleges →
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Link
            href="/colleges"
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
              Discover Colleges
            </h3>
            <p className="text-sm text-slate-500">Browse and filter through our database of top institutions.</p>
          </Link>

          <Link
            href="/predictor"
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
              AI Predictor
            </h3>
            <p className="text-sm text-slate-500">Get personalized college matches based on your exam rank.</p>
          </Link>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors border border-red-100"
          >
            <FiLogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
