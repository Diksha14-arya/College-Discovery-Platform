"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { FiMail, FiLock, FiGithub, FiCompass, FiEye, FiEyeOff } from "react-icons/fi"
import { FaGoogle } from "react-icons/fa"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        toast.error("Invalid credentials")
      } else {
        toast.success("Successfully logged in!")
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" })
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
              Discover Your Perfect College Match
            </h1>
            <p className="text-lg text-indigo-100 mb-8">
              Join thousands of students who have found their dream colleges using our AI-powered discovery platform.
            </p>
            
            {/* Mock stats or social proof */}
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-bold">10k+</p>
                <p className="text-indigo-200">Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-indigo-200">Colleges</p>
              </div>
              <div>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-indigo-200">Success Rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
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
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors bg-slate-50 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
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
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaGoogle className="text-red-500" />
                Google
              </button>
              <button
                onClick={() => handleSocialLogin('github')}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FiGithub />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
