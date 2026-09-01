import { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import JobApplicationForm from "./JobApplicationForm";
import jobAPI, { type Job as JobType } from "../API/jobs";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock,
  Building2,
  Filter,
  TrendingUp,
  Sparkles,
  Heart,
  ExternalLink,
  X,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

function Userjobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobType | null>(null);

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [jobs, selectedFilter, savedJobs]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await jobAPI.searchJobs({
        query: searchQuery.trim(),
        location: locationQuery.trim(),
      });

      if (response.data.success) {
        // Map _id to id for backward compatibility
        const mappedJobs = response.data.jobs.map(job => ({
          ...job,
          id: job._id || job.id
        }));
        setJobs(mappedJobs);
      } else {
        setError(response.data.message || 'Failed to fetch jobs');
        setJobs([]);
      }
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch jobs. Please try again later.';
      setError(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (selectedFilter === "remote") {
      // Check workMode field for remote jobs (case-insensitive)
      filtered = filtered.filter(job => 
        job.workMode?.toLowerCase() === 'remote' ||
        // Fallback: check if location or type mentions remote
        job.location?.toLowerCase().includes('remote') ||
        job.type?.toLowerCase().includes('remote')
      );
    } else if (selectedFilter === "hybrid") {
      // Check workMode field for hybrid jobs
      filtered = filtered.filter(job => 
        job.workMode?.toLowerCase() === 'hybrid' ||
        job.location?.toLowerCase().includes('hybrid')
      );
    } else if (selectedFilter === "onsite") {
      // Check workMode field for on-site jobs
      filtered = filtered.filter(job => 
        job.workMode?.toLowerCase() === 'on-site' ||
        (!job.workMode && !job.location?.toLowerCase().includes('remote'))
      );
    } else if (selectedFilter === "saved") {
      filtered = filtered.filter(job => savedJobs.includes(job.id || job._id));
    } else if (selectedFilter === "full-time") {
      // Check if type is full-time
      filtered = filtered.filter(job => 
        job.type.toLowerCase().includes('full')
      );
    } else if (selectedFilter === "part-time") {
      // Check if type is part-time
      filtered = filtered.filter(job => 
        job.type.toLowerCase().includes('part')
      );
    } else if (selectedFilter === "contract") {
      // Check if type is contract
      filtered = filtered.filter(job => 
        job.type.toLowerCase().includes('contract')
      );
    } else if (selectedFilter === "internship") {
      // Check if type is internship
      filtered = filtered.filter(job => 
        job.type.toLowerCase().includes('internship')
      );
    }

    setFilteredJobs(filtered);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`;
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const filters = [
    { id: "all", label: "All Jobs", count: jobs.length },
    { id: "full-time", label: "Full-time", count: jobs.filter(j => j.type.toLowerCase().includes('full')).length },
    { id: "part-time", label: "Part-time", count: jobs.filter(j => j.type.toLowerCase().includes('part')).length },
    { id: "contract", label: "Contract", count: jobs.filter(j => j.type.toLowerCase().includes('contract')).length },
    { id: "internship", label: "Internship", count: jobs.filter(j => j.type.toLowerCase().includes('internship')).length },
    { 
      id: "remote", 
      label: "Remote", 
      count: jobs.filter(j => 
        j.workMode?.toLowerCase() === 'remote' || 
        j.location?.toLowerCase().includes('remote') ||
        j.type?.toLowerCase().includes('remote')
      ).length 
    },
    { 
      id: "hybrid", 
      label: "Hybrid", 
      count: jobs.filter(j => 
        j.workMode?.toLowerCase() === 'hybrid' ||
        j.location?.toLowerCase().includes('hybrid')
      ).length 
    },
    { 
      id: "onsite", 
      label: "On-site", 
      count: jobs.filter(j => 
        j.workMode?.toLowerCase() === 'on-site' ||
        (!j.workMode && !j.location?.toLowerCase().includes('remote'))
      ).length 
    },
    { id: "saved", label: "Saved", count: savedJobs.length },
  ];

  return (
    <>
      <UserNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white">
                <Sparkles size={16} className="text-yellow-300" />
                <span>{loading ? 'Searching...' : `${jobs.length} Jobs Available`}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                Find Your Dream Job 🚀
              </h1>

              <p className="text-lg md:text-xl text-cyan-100 max-w-2xl mx-auto">
                Search live job listings from top companies worldwide
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="max-w-4xl mx-auto mt-8">
                <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 outline-none text-slate-700 placeholder-slate-400"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-3 px-4 border-t sm:border-t-0 sm:border-l border-slate-200">
                    <MapPin className="text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="City, state, or country"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="w-full py-2 outline-none text-slate-700 placeholder-slate-400"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </form>
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
              </div>
            </div>
          )}

          {/* Success Message */}
          {!loading && !error && jobs.length > 0 && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-green-900 font-semibold">Success!</h3>
                <p className="text-green-700 text-sm mt-1">Found {jobs.length} live job listings</p>
              </div>
            </div>
          )}

          {/* Filters */}
          {!loading && jobs.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="text-slate-600" size={20} />
                <h2 className="text-xl font-bold text-slate-900">Filter Jobs</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                      selectedFilter === filter.id
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {filter.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      selectedFilter === filter.id
                        ? 'bg-white/20'
                        : 'bg-slate-100'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Header */}
          {!loading && filteredJobs.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedFilter === "all" ? "All Jobs" : 
                   selectedFilter === "full-time" ? "Full-time Jobs" :
                   selectedFilter === "part-time" ? "Part-time Jobs" :
                   selectedFilter === "remote" ? "Remote Jobs" :
                   selectedFilter === "hybrid" ? "Hybrid Jobs" :
                   selectedFilter === "onsite" ? "On-site Jobs" :
                   selectedFilter === "contract" ? "Contract Jobs" :
                   selectedFilter === "internship" ? "Internship Jobs" :
                   "Saved Jobs"}
                </h2>
                <p className="text-slate-600 mt-1">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                </p>
              </div>
              
              <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                <TrendingUp size={16} />
                Sort by Relevance
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Job Cards Grid */}
          {!loading && filteredJobs.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredJobs.map((job, index) => {
                const jobId = job.id || job._id;
                return (
                <div
                  key={jobId}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                        {(job.company || '').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-600 mt-1">
                          <Building2 size={14} />
                          <span className="text-sm font-medium truncate">{job.company}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleSaveJob(jobId)}
                      className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                        savedJobs.includes(jobId)
                          ? 'bg-pink-100 text-pink-600'
                          : 'bg-slate-100 text-slate-400 hover:bg-pink-100 hover:text-pink-600'
                      }`}
                    >
                      <Heart size={18} fill={savedJobs.includes(jobId) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <DollarSign size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{job.salary || 'Not disclosed'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{getTimeAgo(job.createdAt)}</span>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                      <Briefcase size={16} />
                      View Details
                    </button>
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                    >
                      <ExternalLink size={16} />
                      Apply
                    </button>
                  </div>
                </div>
              )})}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredJobs.length === 0 && jobs.length > 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <Filter className="text-slate-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No jobs match your filters</h3>
              <p className="text-slate-600 mb-4">Try selecting different filters</p>
              <button
                onClick={() => setSelectedFilter('all')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Empty State - No Jobs at All */}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <Search className="text-slate-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search criteria or keywords</p>
              <button
                onClick={() => fetchJobs()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
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
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {(selectedJob.company || '').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedJob.title}</h2>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 size={16} />
                    <span className="font-medium">{selectedJob.company}</span>
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
                  <MapPin className="text-blue-600" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Location</p>
                    <p className="text-sm text-slate-900 font-semibold">{selectedJob.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <DollarSign className="text-green-600" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Salary</p>
                    <p className="text-sm text-slate-900 font-semibold">{selectedJob.salary || 'Not disclosed'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Briefcase className="text-purple-600" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Job Type</p>
                    <p className="text-sm text-slate-900 font-semibold">{selectedJob.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Clock className="text-orange-600" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Posted</p>
                    <p className="text-sm text-slate-900 font-semibold">{getTimeAgo(selectedJob.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Job Description</h3>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements</h3>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedJob.requirements}
                  </p>
                </div>
              )}

              {/* Apply Button */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setApplyingJob(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <ExternalLink size={18} />
                  Apply Now
                </button>
                <button
                  onClick={() => toggleSaveJob(selectedJob.id || selectedJob._id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    savedJobs.includes(selectedJob.id || selectedJob._id)
                      ? 'bg-pink-100 text-pink-600 border-2 border-pink-200'
                      : 'bg-slate-100 text-slate-700 border-2 border-slate-200 hover:bg-pink-100 hover:text-pink-600 hover:border-pink-200'
                  }`}
                >
                  <Heart size={18} fill={savedJobs.includes(selectedJob.id || selectedJob._id) ? "currentColor" : "none"} />
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

export default Userjobs;
