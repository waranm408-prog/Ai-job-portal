import { useEffect, useState } from 'react';
import { getDashboardStats } from '../API/admin';

interface DashboardStats {
  users: {
    total: number;
    hr: number;
    candidates: number;
    recent: number;
    growth: number;
  };
  jobs: {
    total: number;
    active: number;
    recent: number;
    growth: number;
  };
  applications: {
    total: number;
  };
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Failed to load dashboard statistics</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.users.total}</p>
              <p className="text-xs text-green-600 mt-1">+{stats.users.growth} this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* HR Users */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">HR Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.users.hr}</p>
              <p className="text-xs text-slate-500 mt-1">{stats.users.recent} new this week</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Jobs */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Jobs</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.jobs.total}</p>
              <p className="text-xs text-green-600 mt-1">+{stats.jobs.growth} this month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Applications</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.applications.total}</p>
              <p className="text-xs text-slate-500 mt-1">Across all jobs</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">User Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Job Seekers</p>
                  <p className="text-xs text-slate-500">Regular users</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.users.candidates}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">💼</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">HR Recruiters</p>
                  <p className="text-xs text-slate-500">Employer accounts</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.users.hr}</p>
            </div>
          </div>
        </div>

        {/* Job Status Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Job Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Active Jobs</p>
                  <p className="text-xs text-slate-500">Currently accepting applications</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.jobs.active}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-slate-600 font-bold">○</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Inactive Jobs</p>
                  <p className="text-xs text-slate-500">Paused or closed</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.jobs.total - stats.jobs.active}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Recent Activity (Last 7 Days)</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-3xl font-bold">{stats.users.recent}</p>
            <p className="text-sm opacity-90">New Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.jobs.recent}</p>
            <p className="text-sm opacity-90">New Jobs</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.applications.total}</p>
            <p className="text-sm opacity-90">Total Applications</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
