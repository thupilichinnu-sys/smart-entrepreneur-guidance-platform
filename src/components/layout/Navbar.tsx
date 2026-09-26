import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Bell, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Wifi,
  WifiOff,
  ChevronDown,
  LayoutDashboard,
  Compass,
  MapPin,
  FileCheck,
  Calculator,
  Landmark,
  CalendarCheck,
  Bot,
  Layers,
  History,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Language } from '../../types/auth';

export const Navbar: React.FC<{
  currentRoute: string;
  navigate: (route: string) => void;
  openSearch: () => void;
}> = ({ currentRoute, navigate, openSearch }) => {
  const { user, isAuthenticated, logout, loadDemo } = useAuth();
  const { language, setLanguage, t, lowDataMode, toggleLowDataMode } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: t.navHome, route: isAuthenticated ? '/dashboard' : '/' },
    { label: t.navAssess, route: '/assessment' },
    { label: t.navMarket, route: '/market-intelligence' },
    { label: t.navFinance, route: '/financial-planner' },
    { label: t.navSchemes, route: '/scheme-router' },
    { label: t.navAI, route: '/ai-advisor' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base font-display">
                  SMART ENTREPRENEUR
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 rounded">
                  MoSJE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block line-clamp-1">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Global Search Button */}
            <button
              onClick={openSearch}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Search (Ctrl + K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Low Data Mode Toggle */}
            <button
              onClick={toggleLowDataMode}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                lowDataMode 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={lowDataMode ? 'Low Data Mode Enabled' : 'Enable Low Data Mode'}
            >
              {lowDataMode ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-slate-500" />}
              <span className="hidden xl:inline text-[11px]">{lowDataMode ? 'Low Data' : 'Data'}</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-1.5 pl-7 pr-6 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिन्दी</option>
              </select>
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2.5 pointer-events-none" />
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-3 pointer-events-none" />
            </div>

            {/* Notifications Dropdown */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No notifications</p>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.linkUrl) {
                                navigate(n.linkUrl);
                                setNotifDropdownOpen(false);
                              }
                            }}
                            className={`py-3 px-2 rounded-xl transition-colors cursor-pointer ${
                              n.isRead ? 'hover:bg-slate-50' : 'bg-emerald-50/50 hover:bg-emerald-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-semibold text-slate-900">{n.title}</h4>
                              <span className="text-[10px] text-slate-400">Just now</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth State */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      {t.navProfile}
                    </button>
                    <button
                      onClick={() => { setUserMenuOpen(false); navigate('/activities'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      {t.navActivities}
                    </button>
                    <button
                      onClick={() => { setUserMenuOpen(false); navigate('/reports'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <FileCheck className="w-4 h-4 text-slate-400" />
                      {t.navReports}
                    </button>
                    <button
                      onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      {t.navSettings}
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); navigate('/'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.signOut}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={loadDemo}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Demo Mode</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {t.signIn}
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all"
                >
                  {t.signUp}
                </button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation</span>
            {!isAuthenticated && (
              <button
                onClick={() => { loadDemo(); setMobileMenuOpen(false); navigate('/dashboard'); }}
                className="px-2 py-1 text-xs font-bold bg-amber-100 text-amber-900 rounded-lg"
              >
                Load Demo Entrepreneur
              </button>
            )}
          </div>
          {[
            { label: t.navHome, route: isAuthenticated ? '/dashboard' : '/', icon: LayoutDashboard },
            { label: t.navAssess, route: '/assessment', icon: FileCheck },
            { label: t.navDiscovery, route: '/business-discovery', icon: Compass },
            { label: t.navMarket, route: '/market-intelligence', icon: MapPin },
            { label: t.navFeasibility, route: '/feasibility', icon: FileCheck },
            { label: t.navFinance, route: '/financial-planner', icon: Calculator },
            { label: t.navSchemes, route: '/scheme-router', icon: Landmark },
            { label: t.navRepayment, route: '/repayment', icon: CalendarCheck },
            { label: t.navActionPlan, route: '/action-plan', icon: Layers },
            { label: t.navCompare, route: '/compare', icon: Layers },
            { label: t.navAI, route: '/ai-advisor', icon: Bot },
            { label: t.navProfile, route: '/profile', icon: UserIcon },
            { label: t.navActivities, route: '/activities', icon: History }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(item.route);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  currentRoute === item.route
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
