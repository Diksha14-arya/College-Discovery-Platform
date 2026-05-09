"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiCompass, FiSearch, FiLayers, FiCpu, FiUser, FiBookmark, FiLogOut, FiMenu, FiX } from "react-icons/fi"
import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navLinks = [
    { href: "/colleges", label: "Discover", icon: FiSearch },
    { href: "/compare", label: "Compare", icon: FiLayers },
    { href: "/predictor", label: "AI Predictor", icon: FiCpu },
  ]

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                <FiCompass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                CollegeCompass
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center font-medium text-sm transition-colors relative ${
                    isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  <Icon className="mr-1.5" /> {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-6 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiUser className="w-4 h-4" /> Profile
                      </Link>
                      
                      <Link
                        href="/saved"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiBookmark className="w-4 h-4" /> Saved Colleges
                      </Link>
                      
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => signOut()}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" /> Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-indigo-600 p-2"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-b border-slate-200"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  <link.icon className="w-5 h-5" /> {link.label}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-100">
                {session ? (
                  <>
                    <div className="px-3 py-2 mb-2">
                      <p className="text-sm font-medium text-slate-900">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {session.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <FiUser className="w-5 h-5" /> Profile
                    </Link>
                    <Link
                      href="/saved"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <FiBookmark className="w-5 h-5" /> Saved Colleges
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        signOut()
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <FiLogOut className="w-5 h-5" /> Log out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4 px-3 pt-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-center items-center py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-center items-center py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
