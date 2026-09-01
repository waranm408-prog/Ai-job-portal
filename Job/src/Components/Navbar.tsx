import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Menu, X, Home, Info, Briefcase, HelpCircle, Mail } from 'lucide-react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
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
    { to: "/#home", label: "Home", icon: Home },
    { to: "/#about", label: "About Us", icon: Info },
    { to: "/#service", label: "Services", icon: Briefcase },
    { to: "/#how-it-works", label: "How It Works", icon: HelpCircle },
    { to: "/#contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-2xl blur-sm group-hover:blur-md transition-all"></div>
                <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
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
                  scrolled ? 'text-slate-500' : 'text-blue-100'
                }`}>
                  Find Your Dream Job
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 group ${
                    scrolled
                      ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <link.icon size={16} className="group-hover:scale-110 transition-transform" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                  scrolled
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                Candidate Login
              </Link>
              
              <Link
                to="/hr"
                className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                  scrolled
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                }`}
              >
                <Sparkles size={16} />
                Employer Login
              </Link>

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
            <div className="p-6 space-y-2">
              {/* Mobile Navigation Links */}
              {navLinks.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors">
                    <link.icon size={20} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-3 border-t border-slate-200 mt-4">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                >
                  Candidate Login
                </Link>
                
                <Link
                  to="/hr"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  <Sparkles size={18} />
                  Employer Login
                </Link>
              </div>

              {/* Mobile Footer Info */}
              <div className="pt-6 mt-6 border-t border-slate-200">
                <p className="text-sm text-slate-600 text-center">
                  Join thousands of job seekers finding their perfect career match
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}

export default Navbar;
