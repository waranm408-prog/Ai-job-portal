import { useState, useEffect } from 'react';
import { getHRJobs, updateJob, deleteJob } from '../API/hr';
import type { JobPosting } from '../API/hr';

function ManageJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getHRJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await updateJob(jobId, { status: newStatus } as any);
      await fetchJobs(); // Refresh list
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) {
      return;
    }
    try {
      await deleteJob(jobId);
      await fetchJobs(); // Refresh list
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
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

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-slate-600">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Manage Jobs</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <p className="text-slate-600 mb-4">Edit, pause, or delete your existing job postings.</p>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div key={job._id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-slate-900 text-lg">{job.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Posted {getTimeAgo(job.postedDate)} • {job.applications} application{job.applications !== 1 ? 's' : ''}
                      {job.location && ` • ${job.location}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleToggleStatus(job._id, job.status)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
                    >
                      {job.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleDelete(job._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-center py-8">
            {searchTerm ? 'No jobs found matching your search' : 'No jobs posted yet'}
          </p>
        )}
      </div>
    </div>
  );
}

export default ManageJobs;
