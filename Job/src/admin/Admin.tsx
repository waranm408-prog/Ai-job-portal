import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import HRManagement from './HRManagement';
import JobManagement from './JobManagement';
import ActivityFeed from './ActivityFeed';

type MenuItemType = 'dashboard' | 'users' | 'hrManagement' | 'jobs' | 'activity';

function Admin() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuItemType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('Admin User');

  useEffect(() => {
    document.title = 'Admin Dashboard | AI Job Portal';
    
    // Check if user is admin
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userJson);
      if (!user || !user.is_admin) {
        alert('Access denied. Admin privileges required.');
        navigate('/login');
        return;
      }
      setUserName(user.name || user.email || 'Admin User');
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard' as MenuItemType, icon: '📊', label: 'Dashboard', color: 'blue' },
    { id: 'users' as MenuItemType, icon: '👥', label: 'User Management', color: 'purple' },
    { id: 'hrManagement' as MenuItemType, icon: '💼', label: 'HR Management', color: 'pink' },
    { id: 'jobs' as MenuItemType, icon: '�', label: 'Job Management', color: 'green' },
    { id: 'activity' as MenuItemType, icon: '�', label: 'Activity Feed', color: 'amber' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'hrManagement':
        return <HRManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'activity':
        return <ActivityFeed />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-red-900 to-red-800 text-white transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-red-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-bold text-lg shadow-lg">
              A
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="font-bold text-lg">Admin Portal</h2>
                <p className="text-xs text-red-200">System Administration</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
                activeMenu === item.id
                  ? 'bg-red-700 border-l-4 border-orange-400 text-white'
                  : 'text-red-100 hover:bg-red-700 hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-red-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Sidebar */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 text-center hover:bg-red-700 transition-colors border-t border-red-700"
        >
          {isSidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-slate-600">Welcome back, {userName}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Admin Badge */}
              <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm">
                🛡️ Administrator
              </div>
              {/* Notifications */}
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {/* Profile */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-8 py-4">
          <p className="text-center text-sm text-slate-600">© 2026 Admin Portal - AI Job Portal Platform</p>
        </footer>
      </main>
    </div>
  );
}

export default Admin;