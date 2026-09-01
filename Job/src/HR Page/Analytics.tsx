import { useState, useEffect } from 'react';
import { getAnalytics } from '../API/hr';
import type { AnalyticsData } from '../API/hr';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleJobExpand = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-slate-600">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-slate-600">No analytics data available</div>
      </div>
    );
  }

  const calculateConversionRate = (job: any) => {
    if (job.views === 0) return '0%';
    return ((job.applications / job.views) * 100).toFixed(1) + '%';
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h4 className="text-sm font-medium text-slate-600 mb-2">Average Time to Hire</h4>
          <p className="text-3xl font-bold text-slate-900">{analytics.averageTimeToHire}</p>
          <p className="text-sm text-green-600 mt-2">Industry average: 21 days</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h4 className="text-sm font-medium text-slate-600 mb-2">Application Rate</h4>
          <p className="text-3xl font-bold text-slate-900">{analytics.applicationRate}</p>
          <p className="text-sm text-blue-600 mt-2">Above industry average</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h4 className="text-sm font-medium text-slate-600 mb-2">Offer Acceptance Rate</h4>
          <p className="text-3xl font-bold text-slate-900">{analytics.offerAcceptanceRate}</p>
          <p className="text-sm text-amber-600 mt-2">Target: 80%</p>
        </div>
      </div>

      {/* Application Status Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Application Status Breakdown</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analytics.applicationsByStatus.new}</div>
            <div className="text-sm text-slate-600 mt-1">New Applications</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">{analytics.applicationsByStatus.underReview}</div>
            <div className="text-sm text-slate-600 mt-1">Under Review</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analytics.applicationsByStatus.interviewed}</div>
            <div className="text-sm text-slate-600 mt-1">Interviewed</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{analytics.applicationsByStatus.rejected}</div>
            <div className="text-sm text-slate-600 mt-1">Rejected</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Overview</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-600 mb-2">Total Jobs Posted</p>
            <p className="text-3xl font-bold text-slate-900">{analytics.totalJobs}</p>
          </div>
          <div>
            <p className="text-slate-600 mb-2">Total Applications</p>
            <p className="text-3xl font-bold text-slate-900">{analytics.totalApplications}</p>
          </div>
        </div>
      </div>

      {/* Job Performance Table */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Job Performance</h3>
        {analytics.jobPerformance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Job Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Applications</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Conversion Rate</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {analytics.jobPerformance.map((job: any, i) => (
                  <>
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{job.title}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{job.views}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{job.applications}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{calculateConversionRate(job)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {job.applicants && job.applicants.length > 0 && (
                          <button
                            onClick={() => toggleJobExpand(job._id)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <Users size={14} />
                            View Applicants
                            {expandedJob === job._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedJob === job._id && job.applicants && (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 bg-slate-50">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-slate-900 mb-3">Applicants for {job.title}</h4>
                            {job.applicants.map((applicant: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {applicant.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-900">{applicant.name}</p>
                                    <p className="text-sm text-slate-600">{applicant.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-slate-500">
                                    {new Date(applicant.appliedAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    applicant.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                    applicant.status === 'under_review' ? 'bg-amber-100 text-amber-700' :
                                    applicant.status === 'interviewed' ? 'bg-green-100 text-green-700' :
                                    applicant.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {applicant.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-600 text-center py-8">No job performance data available</p>
        )}
      </div>
    </div>
  );
}

export default Analytics;
