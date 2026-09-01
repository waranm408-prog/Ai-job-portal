import { useState, useEffect } from 'react';
import { getApplications, getHRJobs, updateApplicationStatus } from '../API/hr';
import type { Application, JobPosting } from '../API/hr';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ViewApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedJob, selectedStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsData, jobsData] = await Promise.all([
        getApplications(),
        getHRJobs()
      ]);
      setApplications(appsData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await getApplications(
        selectedJob || undefined,
        selectedStatus || undefined
      );
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleStatusChange = async (jobId: string, applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(jobId, applicationId, newStatus);
      await fetchApplications(); // Refresh list
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'under_review':
        return 'bg-amber-100 text-amber-700';
      case 'interviewed':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // const getStatusLabel = (status: string) => {
  //   switch (status) {
  //     case 'new':
  //       return 'New';
  //     case 'under_review':
  //       return 'Under Review';
  //     case 'interviewed':
  //       return 'Interviewed';
  //     case 'rejected':
  //       return 'Rejected';
  //     default:
  //       return status;
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-slate-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">View Applications</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <p className="text-slate-600 mb-4">Review and manage candidate applications for your job postings.</p>
        
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select 
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Jobs</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="interviewed">Interviewed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {app.candidateName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{app.candidateName}</h4>
                      <p className="text-sm text-slate-600">Applied for: {app.jobTitle}</p>
                      <p className="text-xs text-slate-500">{getTimeAgo(app.appliedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.jobId, app._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(app.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="under_review">Under Review</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {app.resume && (
                      <a
                        href={`${API_BASE_URL}/${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          // Check if resume path exists
                          if (!app.resume) {
                            e.preventDefault();
                            alert('Resume not available');
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                      >
                        📄 View Resume
                      </a>
                    )}
                    {!app.resume && (
                      <span className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm font-semibold cursor-not-allowed">
                        No Resume
                      </span>
                    )}
                    <a
                      href={`mailto:${app.candidateEmail}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-center py-8">No applications found</p>
        )}
      </div>
    </div>
  );
}

export default ViewApplications;
