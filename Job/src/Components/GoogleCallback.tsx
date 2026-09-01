import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      return;
    }

    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);
      setStatus('success');
      
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Logged in as:', payload.email);
        
        // Small delay for better UX
        setTimeout(() => {
          // Redirect based on user role
          if (payload.is_admin) {
            navigate('/admin');
          } else if (payload.role === 'hr') {
            navigate('/mainpage');
          } else {
            navigate('/user');
          }
        }, 1500);
      } catch (err) {
        console.error('Token decode error:', err);
        setTimeout(() => {
          navigate('/user');
        }, 1500);
      }
    } else {
      setStatus('error');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Loading State */}
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                <Loader2 size={48} className="animate-spin text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Completing Sign In...
              </h2>
              <p className="text-slate-600">
                Please wait while we set up your account.
              </p>
              <div className="flex items-center justify-center gap-2 pt-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 animate-bounce">
                <CheckCircle2 size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Sign In Successful!
              </h2>
              <p className="text-slate-600">
                Redirecting you to your dashboard...
              </p>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-full mb-4">
                <AlertCircle size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-slate-600">
                Unable to complete Google sign in. Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoogleCallback;
