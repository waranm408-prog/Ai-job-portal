import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import notificationAPI, { type Notification } from "../API/notifications";
import { 
  Sparkles, 
  Menu, 
  X, 
  LayoutDashboard, 
  Briefcase, 
  Target, 
  FileText, 
  Mail, 
  Bell, 
  User, 
  LogOut,
  BellDot,
  Trash2,
  CheckCheck
} from 'lucide-react';

function UserNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [userInitials, setUserInitials] = useState('U');
  const location = useLocation();

  // Load user data from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        const name = userData.name || userData.email?.split('@')[0] || 'User';
        const email = userData.email || '';
        
        setUserName(name);
        setUserEmail(email);
        
        // Generate initials from name
        const nameInitials = name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        
        setUserInitials(nameInitials || 'U');
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      // Get user email from localStorage if available
      const user = localStorage.getItem('user');
      const userEmail = user ? JSON.parse(user).email : undefined;
      
      const response = await notificationAPI.getNotifications(userEmail);
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const user = localStorage.getItem('user');
      const userEmail = user ? JSON.parse(user).email : undefined;
      
      await notificationAPI.markAllAsRead(userEmail);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      const deletedNotif = notifications.find(n => n.id === id);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "/user", label: "Dashboard", icon: LayoutDashboard },
    { href: "/jobs", label: "Browse Jobs", icon: Briefcase },
    { href: "/match", label: "AI Match", icon: Target },
    { href: "/resume", label: "Resume", icon: FileText },
    { href: "/contanct", label: "Contact", icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to home
    window.location.href = '/';
  };

  const hasNotifications = unreadCount > 0;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_application':
        return '📤';
      case 'new_job_match':
        return '✨';
      case 'application_status':
        return '📋';
      default:
        return '🔔';
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-r from-cyan-500 via-pink-600 to-yellow-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo */}
            <Link to="/user" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl blur-sm group-hover:blur-md transition-all"></div>
                <div className="relative bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Sparkles size={24} className="fill-white text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-xl tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-slate-900' : 'text-white'
                }`}>
                  AI Job Portal
                </span>
                <span className={`text-[10px] font-medium tracking-wider transition-colors duration-300 ${
                  scrolled ? 'text-slate-500' : 'text-cyan-100'
                }`}>
                  Your Career Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 group relative ${
                    isActive(link.href)
                      ? scrolled
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-white/20 text-white'
                      : scrolled
                      ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <link.icon size={16} className="group-hover:scale-110 transition-transform" />
                  {link.label}
                  {isActive(link.href) && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 rounded-full ${
                      scrolled ? 'bg-blue-600' : 'bg-white'
                    }`} />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                    scrolled
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {hasNotifications ? (
                    <BellDot size={20} className="animate-pulse" />
                  ) : (
                    <Bell size={20} />
                  )}
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setNotificationOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-slideDown">
                      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900">Notifications</h3>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
                            </p>
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                            >
                              <CheckCheck size={14} />
                              Mark all read
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {loadingNotifications ? (
                          <div className="p-8 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-sm text-slate-600 mt-2">Loading notifications...</p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell size={40} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">No notifications yet</p>
                            <p className="text-xs text-slate-500 mt-1">We'll notify you when something happens</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group ${
                                !notification.isRead ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-2xl flex-shrink-0">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                                      {notification.title}
                                    </h4>
                                    <button
                                      onClick={() => handleDeleteNotification(notification.id)}
                                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-600 transition-all"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
                                  {notification.jobTitle && (
                                    <div className="mt-2 text-xs text-blue-600 font-medium">
                                      {notification.jobTitle} {notification.company && `at ${notification.company}`}
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-slate-500">{notification.timeAgo}</p>
                                    {!notification.isRead && (
                                      <button
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                                      >
                                        Mark as read
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
                          <Link 
                            to="/notifications"
                            onClick={() => setNotificationOpen(false)}
                            className="text-sm text-blue-600 font-semibold hover:text-blue-700"
                          >
                            View All Notifications
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Profile Dropdown */}
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group ${
                  scrolled
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/30 group-hover:ring-white/50 transition-all">
                  {userInitials}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-sm font-semibold leading-tight truncate max-w-[120px]" title={userName}>
                    {userName}
                  </p>
                  <p className={`text-xs leading-tight ${scrolled ? 'text-slate-500' : 'text-cyan-100'}`}>
                    View Profile
                  </p>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  scrolled
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <LogOut size={16} />
                <span className="hidden xl:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                scrolled
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
            onClick={() => setMenuOpen(false)}
          />

          {/* Mobile Menu */}
          <div className="fixed top-16 md:top-20 right-0 w-full sm:w-80 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-white shadow-2xl z-50 lg:hidden animate-slideInRight overflow-y-auto">
            <div className="p-6">
              
              {/* User Profile Card */}
              <Link 
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white mb-6 group hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl ring-2 ring-white/30">
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg truncate">{userName}</p>
                  {userEmail && (
                    <p className="text-xs text-cyan-100 truncate">{userEmail}</p>
                  )}
                  <p className="text-xs text-cyan-100 mt-0.5">View & manage account</p>
                </div>
                <User size={20} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>

              {/* Notifications Badge */}
              {hasNotifications && (
                <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                  <BellDot size={20} className="text-blue-600" />
                  <span className="text-sm text-blue-800 font-medium">
                    You have {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 group ${
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-100'
                        : 'text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-100'
                        : 'bg-slate-100 group-hover:bg-blue-100'
                    }`}>
                      <link.icon size={20} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-medium flex-1">{link.label}</span>
                    {isActive(link.href) && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile Logout Button */}
              <div className="pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>

              {/* Mobile Footer Info */}
              <div className="pt-6 mt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center leading-relaxed">
                  Need help? Contact support or visit our help center
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" />

      {/* Add animation styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default UserNavbar;