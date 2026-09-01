import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';

function HRPage() {
  useEffect(() => {
    document.title = 'HR Page | AI Job Portal';
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg shadow-purple-200/30">
            HR Page
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Employer access for HR and hiring teams
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-12">
            Choose how you'd like to continue: sign in with an existing account or create a new HR employer profile.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <Link
              to="/login?role=hr"
              className="group block rounded-[2rem] border border-slate-200 bg-white p-10 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 text-white mb-6 shadow-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Employer Login</h2>
              <p className="text-slate-600">
                Sign in to your HR dashboard and manage postings, applications, and candidate matches.
              </p>
            </Link>

            <Link
              to="/signup?role=hr"
              className="group block rounded-[2rem] border border-slate-200 bg-white p-10 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-pink-600 text-white mb-6 shadow-lg">
                <span className="text-2xl">📝</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Employer Signup</h2>
              <p className="text-slate-600">
                Create your HR account, post new roles, and discover talent faster with AI-driven tools.
              </p>
            </Link>
          </div>

          <div className="mt-12 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-3">HR role support is live</h3>
            <p className="text-slate-100 leading-7">
              Your employer account will now be created with the HR role and redirected to the HR dashboard once authenticated.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HRPage;
