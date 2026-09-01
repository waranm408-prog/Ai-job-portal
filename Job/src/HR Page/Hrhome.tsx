import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HRDashboard from './HRDashboard';
import PostJob from './PostJob';
import ViewApplications from './ViewApplications';
import ManageJobs from './ManageJobs';
import AIMatching from './AIMatching';
import Analytics from './Analytics';
import CompanyProfile from './CompanyProfile';

type MenuItemType = 'dashboard' | 'postJob' | 'applications' | 'manageJobs' | 'aiMatching' | 'analytics' | 'companyProfile';

function HRHome() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuItemType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('HR User');

  useEffect(() => {
    document.title = 'HR Dashboard | AI Job Portal';
    
    // Get user name from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.email || 'HR User');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard' as MenuItemType, icon: '📊', label: 'Dashboard', color: 'blue' },
    { id: 'postJob' as MenuItemType, icon: '➕', label: 'Post New Job', color: 'green' },
    { id: 'applications' as MenuItemType, icon: '📄', label: 'View Applications', color: 'purple' },
    { id: 'manageJobs' as MenuItemType, icon: '💼', label: 'Manage Jobs', color: 'indigo' },
    { id: 'aiMatching' as MenuItemType, icon: '🤖', label: 'AI Matching', color: 'pink' },
    { id: 'analytics' as MenuItemType, icon: '📈', label: 'Analytics', color: 'amber' },
    { id: 'companyProfile' as MenuItemType, icon: '🏢', label: 'Company Profile', color: 'cyan' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <HRDashboard />;
      case 'postJob':
        return <PostJob />;
      case 'applications':
        return <ViewApplications />;
      case 'manageJobs':
        return <ManageJobs />;
      case 'aiMatching':
        return <AIMatching />;
      case 'analytics':
        return <Analytics />;
      case 'companyProfile':
        return <CompanyProfile />;
      default:
        return <HRDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg shadow-lg">
              HR
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="font-bold text-lg">HR Portal</h2>
                <p className="text-xs text-slate-400">Employer Dashboard</p>
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
                  ? 'bg-slate-700 border-l-4 border-blue-500 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
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
          className="p-3 text-center hover:bg-slate-700 transition-colors border-t border-slate-700"
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
              {/* Notifications */}
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {/* Profile */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
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
          <p className="text-center text-sm text-slate-600">© 2026 HR Portal - AI Job Portal Platform</p>
        </footer>
      </main>
    </div>
  );
}

export default HRHome;
