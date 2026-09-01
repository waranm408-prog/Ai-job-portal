import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Contanct from "../Components/Contanct";
function Dashboard() {
  //Menu state

  return (
    <>
      <Navbar />
      {/* Main content */}
      <section id="home">
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <section
          id="about"
          className="lg:col-span-5 space-y-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 text-pink-600 font-bold text-xs px-4 py-2 rounded-full tracking-wide">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              className="text-pink-500"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
            AI-Powered Job Matchmaking
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Find Your Dream Job with{" "}
            <span className="bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            AI Job Portal helps you discover the perfect career opportunities
            using intelligent job matching, resume analysis, and personalized
            recommendations.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button className=" bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-sm px-8 py-4 rounded-full shadow-xl shadow-purple-200 flex items-center gap-3 group transition-all transform hover:-translate-y-0.5">
              <span>
                <Link to="/login">Get Started</Link>
              </span>
              <div className="bg-white/20 p-1 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>

            <button className="border-2 border-indigo-500 text-indigo-600 font-bold text-sm px-8 py-3.5 rounded-full hover:bg-indigo-50 transition flex items-center gap-2">
              <span>Explore Jobs</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </section>
        <section className="lg:col-span-7 relative flex justify-center items-center pt-8 lg:pt-0">
          <div className="relative w-full max-w-145 aspect-4/3">
            <div className="absolute top-[5%] right-[15%] bg-white border border-slate-100 shadow-2xl p-4 rounded-2xl flex items-center gap-3 max-w-xs z-30 transform translate-y-2 animate-bounce duration-4000">
              <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6v12" />
                  <path d="M8 10h8" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">
                  AI Assistant
                </h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  We found{" "}
                  <span className="text-purple-600 font-bold">24 jobs</span>{" "}
                  perfect for you!
                </p>
              </div>
            </div>

            <div className="absolute bottom-[8%] left-[5%] w-[82%] bg-white border border-slate-100 rounded-4xl shadow-2xl p-6 md:p-8 z-10">
              <div className="flex items-center gap-1.5 border-b border-slate-50 pb-4 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50/60 rounded-2xl p-5 border border-slate-100">
                  <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest mb-3">
                    AI Match Score
                  </span>

                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-slate-100"
                        stroke-width="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-indigo-500"
                        stroke-dasharray="92, 100"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        92%
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-extrabold text-emerald-500 mt-4 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    Great Match!
                  </span>
                </div>

                <div className="md:col-span-7 space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    Recommended Jobs
                  </span>

                  <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                        M
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Frontend Developer
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Google • Remote
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      95% Match
                    </span>
                  </div>

                  <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        A
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          AI/ML Engineer
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Microsoft • Bangalore
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      90% Match
                    </span>
                  </div>

                  <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                        U
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          UI/UX Designer
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Figma • Remote
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      88% Match
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[2%] left-0 bg-white border border-slate-100 shadow-2xl p-4 rounded-2xl w-40 z-20 transform -translate-x-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="w-12 h-1.5 bg-slate-200 rounded"></div>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[8px] font-bold text-slate-400">
                    Verified Skills
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[8px] font-bold text-slate-400">
                    Parsed Experience
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[10%] left-[30%] bg-linear-to-br from-indigo-600 to-purple-600 w-24 h-20 rounded-2xl shadow-xl z-0 transform -rotate-6"></div>

            <div className="absolute bottom-0 right-[4%] bg-pink-50/90 backdrop-blur-md border border-pink-100 rounded-full px-5 py-3.5 flex items-center gap-3 w-72 shadow-xl z-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                className="text-pink-400"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs, skills, companies..."
                className="bg-transparent border-none outline-none text-[11px] w-full text-slate-600 placeholder-pink-300 font-medium"
                disabled
              />
            </div>
          </div>
        </section>
      </main>
     

      <Footer />
     
      <section id="service" className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.32em] text-indigo-600 font-bold">
              Our Services
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4">
              What we offer
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-3">AI Job Matching</h3>
              <p className="text-slate-500">
                Personalized job recommendations based on your skills and experience.
              </p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-3">Resume Analyzer</h3>
              <p className="text-slate-500">
                Smart resume feedback to improve your application success rate.
              </p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-3">Career Guidance</h3>
              <p className="text-slate-500">
                Career insights and interview tips tailored for you.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.32em] text-purple-600 font-bold">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4">
              3 simple steps to find your next role
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-3">Create Profile</h3>
              <p className="text-slate-500">
                Sign up and build your professional profile in minutes.
              </p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-3">Get Matched</h3>
              <p className="text-slate-500">
                Our AI analyzes your skills and matches you to the best jobs.
              </p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-3">Apply Confidently</h3>
              <p className="text-slate-500">
                Use AI-powered insights to submit stronger applications.
              </p>
            </div>
          </div>
        </div>
      </section>
       </section> 
        <Contanct />
    </>
  );
}

export default Dashboard;
