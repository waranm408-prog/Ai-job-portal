import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import api from "../API/axios";
import { 
  FileText, 
  Star, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  Upload,
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Target,
  Award,
  Clock,
  Building2
} from "lucide-react";

interface JobStat {
  id: number;
  jobtype: string;
  jobvalue: string;
  icon: any;
  color: string;
  bgColor: string;
  trend?: string;
}

interface AIJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo: string | null;
  skills: string[];
}

function UserDashboard() {
  const [greeting, setGreeting] = useState("Welcome Back");
  const [userName, setUserName] = useState("User");
  const [aiJobs, setAiJobs] = useState<AIJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        const name = userData.name || userData.email?.split('@')[0] || 'User';
        setUserName(name);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const [jobStats, setJobStats] = useState<JobStat[]>([
    {
      id: 1,
      jobtype: "Total Jobs",
      jobvalue: "0",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "Loading..."
    },
    {
      id: 2,
      jobtype: "Remote Jobs",
      jobvalue: "0",
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      trend: "Loading..."
    },
    {
      id: 3,
      jobtype: "Recent Jobs",
      jobvalue: "0",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "Last 7 days"
    },
    {
      id: 4,
      jobtype: "Top Companies",
      jobvalue: "0",
      icon: Sparkles,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      trend: "Loading..."
    },
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Fetch jobs from database
  useEffect(() => {
    fetchRecommendedJobs();
    fetchJobStatistics();
  }, []);

  const fetchJobStatistics = async () => {
    setStatsLoading(true);
    try {
      const response = await api.get('/api/jobs/stats/overview');
      
      if (response.data.success) {
        const stats = response.data.stats;
        
        setJobStats([
          {
            id: 1,
            jobtype: "Total Jobs",
            jobvalue: stats.totalJobs.toString(),
            icon: FileText,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            trend: "Active listings"
          },
          {
            id: 2,
            jobtype: "Remote Jobs",
            jobvalue: stats.remoteJobs.toString(),
            icon: Star,
            color: "text-amber-600",
            bgColor: "bg-amber-100",
            trend: stats.totalJobs > 0 ? `${Math.round((stats.remoteJobs / stats.totalJobs) * 100)}% of total` : '0%'
          },
          {
            id: 3,
            jobtype: "Recent Jobs",
            jobvalue: stats.recentJobs.toString(),
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            trend: "Last 7 days"
          },
          {
            id: 4,
            jobtype: "Top Company",
            jobvalue: stats.topCompanies[0]?.count.toString() || "0",
            icon: Sparkles,
            color: "text-pink-600",
            bgColor: "bg-pink-100",
            trend: stats.topCompanies[0]?.company || "N/A"
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRecommendedJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/jobs', {
        params: {
          limit: 3
        }
      });

      if (response.data.success) {
        // Get first 3 jobs for dashboard
        const topJobs = response.data.jobs.slice(0, 3).map((job: any) => ({
          id: job._id || job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary || 'Not disclosed',
          type: job.type,
          logo: null,
          skills: []
        }));
        setAiJobs(topJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { id: 1, text: "Add GitHub Portfolio Link", priority: "high" },
    { id: 2, text: "Include More Projects", priority: "medium" },
    { id: 3, text: "Add AWS & Docker Skills", priority: "high" },
    { id: 4, text: "Highlight Internship Experience", priority: "medium" },
  ];

  const resumeScore = 88;

  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-green-600 bg-green-100 border-green-200";
    if (match >= 75) return "text-blue-600 bg-blue-100 border-blue-200";
    return "text-amber-600 bg-amber-100 border-amber-200";
  };

  const calculateMatchScore = (skills: string[]) => {
    // Simple match calculation based on number of skills
    const baseScore = 70;
    const skillBonus = Math.min(skills.length * 3, 25);
    return Math.min(baseScore + skillBonus, 98);
  };

  return (
    <>
      <UserNavbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        
        {/* Hero Section with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600">
          {/* Animated Background Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Left Content */}
              <div className="flex-1 text-white space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles size={16} className="text-yellow-300" />
                  <span>AI-Powered Career Platform</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  {greeting}, {userName}! 👋
                </h1>

                <p className="text-lg md:text-xl text-cyan-100 max-w-2xl">
                  Your personalized dashboard is ready with AI-powered job recommendations tailored just for you.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link 
                    to="/resume" 
                    className="group flex items-center gap-2 bg-white text-blue-600 px-6 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Upload size={20} />
                    Upload Resume
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link 
                    to="/jobs" 
                    className="group flex items-center gap-2 border-2 border-white text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                  >
                    <Search size={20} />
                    Browse Jobs
                  </Link>
                </div>
              </div>

              {/* Right Stats Preview */}
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Your Progress</p>
                      <p className="text-white font-bold text-lg">Excellent!</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/90">
                      <span>Profile Complete</span>
                      <span className="font-bold">95%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-[95%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {statsLoading ? (
              // Loading skeleton for stats
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-200 w-12 h-12"></div>
                    <div className="w-5 h-5 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                </div>
              ))
            ) : (
              jobStats.map((stat, index) => (
                <div
                  key={stat.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2 border border-slate-100 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={stat.color} size={24} />
                    </div>
                    <Target className="text-slate-300 group-hover:text-slate-400 transition-colors" size={20} />
                  </div>
                  
                  <h3 className="text-slate-600 font-medium text-sm mb-2">{stat.jobtype}</h3>
                  <p className={`text-4xl font-black ${stat.color} mb-2`}>{stat.jobvalue}</p>
                  
                  {stat.trend && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <TrendingUp size={12} className="text-green-500" />
                      <span className="truncate">{stat.trend}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* AI Recommended Jobs Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">AI Recommended Jobs</h2>
                  <p className="text-slate-600">Perfectly matched to your skills</p>
                </div>
              </div>
              
              <Link 
                to="/jobs"
                className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
              >
                View All Jobs
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading State
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
                      <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded"></div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
                      <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                    </div>
                  </div>
                ))
              ) : aiJobs.length === 0 ? (
                // Empty State
                <div className="col-span-3 text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <Briefcase className="text-slate-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Available</h3>
                  <p className="text-slate-600 mb-4">Check back later for new opportunities</p>
                  <Link 
                    to="/jobs"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Browse All Jobs
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                // Job Cards
                aiJobs.map((job, index) => {
                  const matchScore = calculateMatchScore(job.skills);
                  return (
                    <div
                      key={job.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Company Logo & Match Badge */}
                      <div className="flex items-start justify-between mb-4">
                        {job.logo ? (
                          <img 
                            src={job.logo} 
                            alt={job.company}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {job.company.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getMatchColor(matchScore)}`}>
                          {matchScore}% Match
                        </span>
                      </div>

                      {/* Job Details */}
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-slate-600 mb-4">
                        <Building2 size={16} />
                        <p className="text-sm font-medium truncate">{job.company}</p>
                      </div>

                      {/* Job Meta */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={14} className="text-slate-400" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <DollarSign size={14} className="text-slate-400" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock size={14} className="text-slate-400" />
                          <span>{job.type}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link
                          to="/jobs"
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all hover:shadow-lg"
                        >
                          <Briefcase size={16} />
                          View Details
                        </Link>
                        <button className="p-2.5 border-2 border-slate-200 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all">
                          <Star size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Link 
              to="/jobs"
              className="md:hidden flex items-center justify-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Jobs
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Resume Analyzer Section */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">AI Resume Analyzer</h2>
                <p className="text-slate-600">Your resume performance insights</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Resume Score */}
              <div className="relative">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-slate-700 mb-4">Resume Score</h3>
                  
                  {/* Circular Progress */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#gradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - resumeScore / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-4xl font-black text-slate-900">{resumeScore}</span>
                        <span className="text-sm text-slate-600 font-medium">/ 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                      <CheckCircle2 size={16} />
                      Excellent Score!
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              <div>
                <h3 className="text-lg font-bold text-slate-700 mb-4">AI Suggestions</h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="group flex items-start gap-3 p-4 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-slate-100 hover:border-blue-200"
                    >
                      <div className={`mt-0.5 p-1 rounded-full ${
                        suggestion.priority === 'high' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Target size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                          {suggestion.text}
                        </p>
                        <span className={`text-xs font-semibold ${
                          suggestion.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {suggestion.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                        </span>
                      </div>
                      <ArrowRight 
                        size={16} 
                        className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                      />
                    </div>
                  ))}
                </div>

                <Link
                  to="/resume"
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Improve Resume
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
