import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import api from '../API/axios';
import axios from 'axios';
import Navbar from './Navbar';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
  Sparkles
} from 'lucide-react';

function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const savedEmail = localStorage.getItem('resetEmail') || '';
  const [email, setEmail] = useState(savedEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (step === 1 && otpInputRefs[0].current) {
      otpInputRefs[0].current.focus();
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (value && !/^\d$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      otpInputRefs[nextEmptyIndex].current?.focus();
    } else {
      otpInputRefs[5].current?.focus();
    }
  };

  const validateStep1 = () => {
    const otpValue = otp.join('');
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email address is invalid');
      return false;
    }
    if (otpValue.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!validateStep1()) return;
    
    setLoading(true);
    // Simulate OTP verification (you can add actual API call here if needed)
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleResetPassword = async () => {
    setError('');
    if (!validateStep2()) return;
    
    setLoading(true);
    try {
      await api.post(
        '/auth/reset-password',
        {
          email,
          otp: otp.join(''),
          password
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      setStep(3);
      localStorage.removeItem('resetEmail');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      let errorMsg = 'Unable to reset password. Please try again.';
      
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.error || error.message || errorMsg;
      } else {
        errorMsg = error.message || errorMsg;
      }

      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
        errorMsg = 'Cannot connect to server. Make sure backend is running on http://localhost:3000';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, text: '', color: '' };
    if (pass.length < 6) return { strength: 25, text: 'Weak', color: 'bg-red-500' };
    if (pass.length < 8) return { strength: 50, text: 'Fair', color: 'bg-orange-500' };
    if (pass.length < 10) return { strength: 75, text: 'Good', color: 'bg-yellow-500' };
    return { strength: 100, text: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to Login Link */}
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Login</span>
          </Link>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                    step >= s 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-110' 
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {step > s ? <CheckCircle2 size={20} /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                      step > s ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 mb-1">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: Verify OTP */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
                    <Shield size={32} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 mb-2">Verify OTP</h1>
                  <p className="text-slate-600">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading || !!savedEmail}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 text-center">
                    Enter OTP Code
                  </label>
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpInputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        disabled={loading}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 text-center mt-3">
                    Paste your OTP code or type it manually
                  </p>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Set New Password */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
                    <KeyRound size={32} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 mb-2">New Password</h1>
                  <p className="text-slate-600">
                    Create a strong password for your account
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">Password Strength</span>
                        <span className={`font-semibold ${
                          passwordStrength.strength === 100 ? 'text-green-600' :
                          passwordStrength.strength === 75 ? 'text-yellow-600' :
                          passwordStrength.strength === 50 ? 'text-orange-600' : 'text-red-600'
                        }`}>{passwordStrength.text}</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      Passwords do not match
                    </p>
                  )}
                  
                  {confirmPassword && password === confirmPassword && (
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Passwords match
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={loading || !password || password !== confirmPassword}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <CheckCircle2 size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4 zoom-in">
                <div className="relative inline-block">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 animate-bounce">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles size={24} className="text-yellow-400 animate-pulse" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-black text-slate-900 mb-3">Password Reset Successfully!</h1>
                  <p className="text-slate-600 text-lg mb-6">
                    Your password has been updated successfully.
                  </p>
                </div>

                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
                  <p className="text-green-800 font-semibold mb-2">What's Next?</p>
                  <p className="text-green-700 text-sm">
                    Redirecting you to the login page in a moment...
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
                >
                  Go to Login Now
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Info Box - Only show on steps 1 and 2 */}
          {step < 3 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <p className="text-sm text-blue-800">
                {step === 1 && (
                  <>
                    <strong>Note:</strong> Check your email inbox and spam folder for the OTP code. The code expires in 15 minutes.
                  </>
                )}
                {step === 2 && (
                  <>
                    <strong>Tip:</strong> Use a strong password with at least 8 characters, including letters, numbers, and symbols.
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
