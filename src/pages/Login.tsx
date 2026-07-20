import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Where to redirect after login (default /dashboard)
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    '/dashboard'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setIsSubmitting(true)
    try {
      const success = await login(email, password)
      if (success) {
        navigate(from, { replace: true })
      } else {
        setError(
          'Invalid email or password. Minimum password length is 4 characters.',
        )
      }
    } catch {
      setError('An error occurred while signing in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemo = () => {
    setEmail('ops.manager@lunchspot.com')
    setPassword('admin123')
    setError(null)
  }

  return (
    <main className='min-h-screen bg-[#f7f8fa] p-4 sm:p-6 lg:p-8 font-sans flex flex-col justify-between'>
      <div className='mx-auto max-w-7xl w-full space-y-6 flex-1 flex flex-col justify-between'>
        {/* Public Header matching Home.tsx */}
        <header className='flex items-center justify-between'>
          <Link to='/' className='flex items-center gap-3 group'>
            <div className='grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm group-hover:bg-blue-600 transition-colors'>
              L
            </div>
            <div>
              <h1 className='text-xl font-bold tracking-tight text-slate-900'>
                LunchSpot
              </h1>
              <p className='text-xs text-slate-500'>Operations Portal</p>
            </div>
          </Link>

          <Link
            to='/'
            className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm'
          >
            <ArrowLeft size={14} />
            <span>Live Availability</span>
          </Link>
        </header>

        {/* Central Card Grid */}
        <div className='my-auto py-4'>
          <div className='flex gap-6 lg:gap max-w-fit mx-auto'>
            <div className='dashboard-card p-6 sm:p-10 flex flex-col justify-between space-y-6'>
              <div className='space-y-6'>
                <div>
                  <h2 className='text-2xl font-bold tracking-tight text-slate-900'>
                    Welcome back
                  </h2>
                  <p className='mt-1 text-xs text-slate-500'>
                    Sign in to your account to manage canteens and view live
                    occupancy.
                  </p>
                </div>

                {/* Demo Account Box */}
                <div className='p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3'>
                  <div className='space-y-0.5'>
                    <span className='text-[10px] font-bold uppercase tracking-wider text-slate-500 block'>
                      Testing Demo Account
                    </span>
                    <span className='text-xs font-semibold text-slate-700 block'>
                      ops.manager@lunchspot.com
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={fillDemo}
                    className='px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-xl transition-colors shadow-sm cursor-pointer shrink-0'
                  >
                    Fill Details
                  </button>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className='p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5'>
                    <span className='h-2 w-2 rounded-full bg-red-500 shrink-0' />
                    <span>{error}</span>
                  </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label
                      htmlFor='login-email'
                      className='section-label block'
                    >
                      Email Address
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
                        <Mail className='h-4 w-4' />
                      </div>
                      <input
                        id='login-email'
                        type='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='name@company.com'
                        className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='login-password'
                      className='section-label block'
                    >
                      Password
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
                        <Lock className='h-4 w-4' />
                      </div>
                      <input
                        id='login-password'
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='••••••••'
                        className='w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer'
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full py-3 px-4 bg-slate-900 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2'
                  >
                    {isSubmitting ? (
                      <>
                        <div className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                        <span>Signing in…</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className='h-4 w-4' />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <p className='text-center text-xs text-slate-400 pt-2'>
                Protected cafeteria operations portal. Contact campus IT for
                access requests.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className='flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 pt-4'>
          <span>© 2026 LunchSpot Systems</span>
          <div className='flex gap-4'>
            <span className='hover:text-slate-600 transition-colors cursor-pointer'>
              Privacy
            </span>
            <span className='hover:text-slate-600 transition-colors cursor-pointer'>
              Security
            </span>
            <span className='hover:text-slate-600 transition-colors cursor-pointer'>
              Status
            </span>
          </div>
        </footer>
      </div>
    </main>
  )
}
