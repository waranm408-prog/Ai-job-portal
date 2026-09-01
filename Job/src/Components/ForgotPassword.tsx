import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useState } from 'react';
import api from "../API/axios";
import axios from "axios";
import Navbar from './Navbar';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

type ForgotValues = { email: string };

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const formik = useFormik<ForgotValues>({
    initialValues: { email: '' },
    validate: (values) => {
      let error: any = {};
      if (values.email === '') {
        error.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        error.email = 'Email address is invalid';
      }
      return error;
    },
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        const response = await api.post(
          '/auth/forgot-password',
          values,
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        const data = response.data;
        
        // Show success message
        setSuccess(data.message || 'OTP sent to your email. Check your inbox and spam folder.');
        
        // If in development and OTP is returned, show it
        if (data.otp) {
          console.log('Development OTP:', data.otp);
          setSuccess(`${data.message} [DEV OTP: ${data.otp}]`);
        }
        
        // Store email for reset page
        localStorage.setItem('resetEmail', values.email);
        
        // Navigate to reset password page after 2 seconds
        setTimeout(() => {
          navigate('/reset-password');
        }, 2000);
        
      } catch (error: any) {
        console.error('Forgot password error:', error);

        let errorMsg = 'Unable to send OTP. Please try again.';

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
    },
  });

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
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
                <Mail size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Forgot Password?</h1>
              <p className="text-slate-600">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
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

            {/* Success Alert */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800 mb-1">Success!</p>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={loading || !!success}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 size={20} />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Send OTP
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-center text-sm text-slate-600">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                  Login here
                </Link>
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The OTP will be valid for 15 minutes. Please check your spam folder if you don't receive the email.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
