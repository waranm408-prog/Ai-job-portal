import { useEffect, useState } from 'react';
import { getActivity } from '../API/admin';

interface Activity {
  type: string;
  description: string;
  timestamp: string;
  icon: string;
}

function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const response = await getActivity(30);
      if (response.success) {
        setActivities(response.activities);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registered':
        return 'bg-blue-100 text-blue-600';
      case 'job_posted':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-slate-900">Activity Feed</h2>
        <p className="text-sm text-slate-600 mt-1">Recent platform activity and events</p>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {loading ? (
          <div className="text-center py-8 text-slate-600">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-slate-600">No recent activity</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getActivityColor(activity.type)}`}>
                  {activity.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-slate-400">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadActivity}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Refresh Activity
        </button>
      </div>
    </div>
  );
}

export default ActivityFeed;
