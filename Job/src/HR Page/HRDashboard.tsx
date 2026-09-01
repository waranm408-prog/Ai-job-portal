import { useState, useEffect } from 'react';
import { getDashboardStats, getRecentActivity } from '../API/hr';
import type { DashboardStats, Activity } from '../API/hr';

function HRDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity()
      ]);
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm font-medium">Active Jobs</span>
            <span className="text-2xl">💼</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats?.activeJobs || 0}</p>
          <p className="text-sm text-green-600 mt-2">↑ {stats?.newJobsThisWeek || 0} new this week</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm font-medium">Total Applications</span>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats?.totalApplications || 0}</p>
          <p className="text-sm text-blue-600 mt-2">All time</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm font-medium">Pending Review</span>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats?.pendingReview || 0}</p>
          <p className="text-sm text-amber-600 mt-2">Needs attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm font-medium">Interviews Scheduled</span>
            <span className="text-2xl">🗓️</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats?.interviewsScheduled || 0}</p>
          <p className="text-sm text-purple-600 mt-2">This week</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h3>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">{activity.message}</p>
                  <p className="text-sm text-slate-600">{getTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
}

export default HRDashboard;
