import { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import JobApplicationForm from "./JobApplicationForm";
import api from "../API/axios";
import {
  Sparkles,
  Target,
  Briefcase,
  MapPin,
  DollarSign,
  CheckCircle2,
  Zap,
  Building2,
  Clock,
  Loader2,
  AlertCircle,
  Heart,
  ExternalLink,
  X
} from "lucide-react";

interface Job {
  _id: string;
  id: string;
  title: string;
  company: string;
  matchScore: number;
  matchReasons: string[];
  missingSkills: string[];
  skills: string[];
  location: string;
  salary: string;
  type: string;
  posted: string;
  logo: string | null;
  description: string;
  fullDescription: string;
  applyUrl: string;
  experience: string;
  isRemote: boolean;
  benefits: string[];
  qualifications: string[];
  responsibilities: string[];
  status: string;
  applications: number;
  views: number;
  createdAt: string;
}

function Aimatch() {
  const [profileScore] = useState(90);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    fetchAIMatches();
  }, []);

  const fetchAIMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get user skills from localStorage (from resume analysis)
      const storedAnalysis = localStorage.getItem('resumeAnalysis');
      let skills = ['JavaScript', 'React', 'Node.js', 'Python']; // Default skills

      if (storedAnalysis) {
        const analysis = JSON.parse(storedAnalysis);
        if (analysis.skills && analysis.skills.length > 0) {
          skills = analysis.skills;
        }
      }

      // Call AI match API
      const response = await api.get('/api/aimatch/quick', {
        params: {
          skills: skills.join(',')
        }
      });

      if (response.data.success) {
        setJobs(response.data.matches);
      } else {
        setError(response.data.message || 'Failed to fetch matches');
      }
    } catch (err: any) {
      console.error('Error fetching AI matches:', err);
      setError(err.response?.data?.message || 'Failed to calculate job matches');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 80) return "text-green-600 bg-green-100 border-green-200";
    if (match >= 60) return "text-blue-600 bg-blue-100 border-blue-200";
    return "text-amber-600 bg-amber-100 border-amber-200";
  };

  const getMatchLabel = (match: number) => {
    if (match >= 80) return "Excellent Match";
    if (match >= 60) return "Good Match";
    return "Fair Match";
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const highMatches = jobs.filter(j => j.matchScore >= 80).length;
  const goodMatches = jobs.filter(j => j.matchScore >= 60 && j.matchScore < 80).length;

  return (
    <>
      <UserNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white">
                <Sparkles size={16} className="text-yellow-300" />
                <span>AI-Powered Job Matching</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                Your Perfect Job Matches ✨
              </h1>

              <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
                AI analyzes your skills and finds the best job opportunities tailored for you
              </p>

              {/* Profile Score */}
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="#ffffff40"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="#ffffff"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 36}`}
                          strokeDashoffset={`${2 * Math.PI * 36 * (1 - profileScore / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-black text-white">{profileScore}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-white/80 text-sm">Profile Score</p>
                      <p className="text-white font-bold text-lg">Excellent!</p>
                    </div>
                  </div>
                </div>

                {!loading && jobs.length > 0 && (
                  <div className="hidden md:flex gap-4">
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 text-center">
                      <p className="text-3xl font-black text-white">{highMatches}</p>
                      <p className="text-white/80 text-sm">Excellent Matches</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 text-center">
                      <p className="text-3xl font-black text-white">{goodMatches}</p>
                      <p className="text-white/80 text-sm">Good Matches</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-red-900 font-semibold">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <button
                  onClick={fetchAIMatches}
                  className="mt-2 text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Matches...</h3>
              <p className="text-slate-600">AI is calculating your perfect job matches</p>
            </div>
          )}

          {/* Jobs Grid */}
          {!loading && jobs.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Your Top Matches</h2>
                  <p className="text-slate-600 mt-1">
                    {jobs.length} jobs ranked by AI match score
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {job.logo ? (
                          <img 
                            src={job.logo} 
                            alt={job.company}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {job.company.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-600 mt-1">
                            <Building2 size={14} />
                            <span className="text-sm font-medium truncate">{job.company}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                          savedJobs.includes(job.id)
                            ? 'bg-pink-100 text-pink-600'
                            : 'bg-slate-100 text-slate-400 hover:bg-pink-100 hover:text-pink-600'
                        }`}
                      >
                        <Heart size={18} fill={savedJobs.includes(job.id) ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Match Score */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border ${getMatchColor(job.matchScore)}`}>
                          <Zap size={14} />
                          {job.matchScore}% Match
                        </span>
                        <span className="text-sm font-semibold text-slate-600">
                          {getMatchLabel(job.matchScore)}
                        </span>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DollarSign size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Briefcase size={14} className="text-slate-400 flex-shrink-0" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={14} className="text-slate-400 flex-shrink-0" />
                        <span>{job.posted}</span>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    {job.matchReasons && job.matchReasons.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-green-600" />
                          Why you're a great fit:
                        </h4>
                        <ul className="space-y-1">
                          {job.matchReasons.slice(0, 2).map((reason, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 4).map((skill, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                              +{job.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                      >
                        <Briefcase size={16} />
                        View Details
                      </button>
                      <button
                        onClick={() => setApplyingJob(job)}
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
                      >
                        <ExternalLink size={16} />
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="text-purple-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No matches found</h3>
              <p className="text-slate-600 mb-4">Try uploading your resume to get personalized matches</p>
              <button
                onClick={fetchAIMatches}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Retry Matching
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {selectedJob.logo ? (
                  <img 
                    src={selectedJob.logo} 
                    alt={selectedJob.company}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {selectedJob.company.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedJob.title}</h2>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 size={16} />
                    <span className="font-medium">{selectedJob.company}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border ${getMatchColor(selectedJob.matchScore)}`}>
                      <Zap size={14} />
                      {selectedJob.matchScore}% Match - {getMatchLabel(selectedJob.matchScore)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Job Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <MapPin className="text-purple-600" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Location</p>
                    <p className="text-sm text-slate-900 font-semibold">{selectedJob.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <DollarSign className="text-green-600" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Salary</p>
                    <p className="text-sm text-slate-900 font-semibold">{selectedJob.salary}</p>
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              {selectedJob.matchReasons && selectedJob.matchReasons.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" size={20} />
                    Why You Match
                  </h3>
                  <ul className="space-y-2">
                    {selectedJob.matchReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Skills */}
              {selectedJob.missingSkills && selectedJob.missingSkills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Target className="text-amber-600" size={20} />
                    Skills to Develop
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.missingSkills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Job Description</h3>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedJob.fullDescription}
                </p>
              </div>

              {/* Required Skills */}
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setApplyingJob(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <ExternalLink size={18} />
                  Apply Now
                </button>
                <button
                  onClick={() => toggleSaveJob(selectedJob.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    savedJobs.includes(selectedJob.id)
                      ? 'bg-pink-100 text-pink-600 border-2 border-pink-200'
                      : 'bg-slate-100 text-slate-700 border-2 border-slate-200 hover:bg-pink-100 hover:text-pink-600 hover:border-pink-200'
                  }`}
                >
                  <Heart size={18} fill={savedJobs.includes(selectedJob.id) ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Application Form Modal */}
      {applyingJob && (
        <JobApplicationForm 
          job={applyingJob} 
          onClose={() => setApplyingJob(null)} 
        />
      )}
    </>
  );
}

export default Aimatch;
