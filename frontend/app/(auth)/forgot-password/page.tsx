"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FiMail, FiCompass, FiArrowLeft } from "react-icons/fi"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSent(true)
      toast.success("Password reset link sent!")
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl rounded-full blur-3xl opacity-20 -top-1/4 -right-1/4 w-[150%] h-[150%] pointer-events-none"></div>
        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-xl">
                <FiCompass className="w-8 h-8" />
              </div>
              <span className="text-3xl font-bold">CollegeCompass</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Regain Access to Your Account
            </h1>
            <p className="text-lg text-indigo-100 mb-8">
              Don't worry, we'll help you get back on track to finding your perfect college.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FiCompass className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              CollegeCompass
            </span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100"
        >
          <div className="mb-8">
            <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors mb-6">
              <FiArrowLeft className="mr-2" /> Back to login
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password</h2>
            <p className="text-slate-500">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors bg-slate-50 outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Check your email</h3>
              <p className="text-green-700 text-sm">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-6 text-sm font-medium text-green-700 hover:text-green-800"
              >
                Try a different email
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
