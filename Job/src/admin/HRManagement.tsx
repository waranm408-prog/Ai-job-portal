import { useEffect, useState } from 'react';
import { getUsers } from '../API/admin';

interface HRUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  is_admin: boolean;
  createdAt: string;
}



function HRManagement() {
  const [hrUsers, setHrUsers] = useState<HRUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHR, setSelectedHR] = useState<HRUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHRUsers();
  }, []);

  const loadHRUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers({
        page: 1,
        limit: 100,
        role: 'hr',
        search: searchTerm
      });
      if (response.success) {
        setHrUsers(response.users);
      }
    } catch (error) {
      console.error('Error loading HR users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadHRUsers();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">HR Management</h2>
            <p className="text-sm text-slate-600 mt-1">Manage HR recruiters and employers</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
              {hrUsers.length} HR {hrUsers.length === 1 ? 'User' : 'Users'}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Search HR users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* HR Users Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Loading HR users...</p>
        </div>
      ) : hrUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">👔</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No HR Users Found</h3>
          <p className="text-slate-600">There are no HR users registered on the platform yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hrUsers.map((hr) => (
            <div
              key={hr._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer border-2 border-transparent hover:border-purple-500"
              onClick={() => setSelectedHR(hr)}
            >
              {/* Header with Avatar */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {getInitials(hr.name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{hr.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      HR RECRUITER
                    </span>
                    {hr.is_admin && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{hr.email}</span>
                </div>
                
                {hr.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{hr.phone}</span>
                  </div>
                )}
                
                {hr.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{hr.location}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Joined {formatDate(hr.createdAt)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHR(hr);
                  }}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HR Details Modal */}
      {selectedHR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold text-2xl">
                    {getInitials(selectedHR.name)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedHR.name}</h3>
                    <p className="text-purple-100">HR Recruiter</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHR(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email:</span>
                    <span className="font-semibold text-slate-900">{selectedHR.email}</span>
                  </div>
                  {selectedHR.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phone:</span>
                      <span className="font-semibold text-slate-900">{selectedHR.phone}</span>
                    </div>
                  )}
                  {selectedHR.location && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-semibold text-slate-900">{selectedHR.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account Information
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">User ID:</span>
                    <span className="font-mono text-sm text-slate-900">{selectedHR._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Role:</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      {selectedHR.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Admin Privileges:</span>
                    {selectedHR.is_admin ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        ✓ Yes
                      </span>
                    ) : (
                      <span className="text-slate-400">No</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Joined:</span>
                    <span className="font-semibold text-slate-900">{formatDate(selectedHR.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">Quick Actions</h4>
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Send Email
                  </button>
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    View Jobs
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex justify-end">
              <button
                onClick={() => setSelectedHR(null)}
                className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HRManagement;
