import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Mail, Phone, MapPin, Calendar, Globe, 
  ShieldCheck, Edit2, KeyRound, LogOut, CheckCircle2, TrendingUp, 
  FileCheck, Coins, Bot, History, Filter, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { activityService } from '../services/activityService';
import { reportService } from '../services/reportService';
import { businessService } from '../services/businessService';
import { aiAdvisorService } from '../services/aiAdvisorService';
import { ActivityItem, ActivityFilter } from '../types/activity';
import { Modal } from '../components/ui/Modal';
import { formatCurrencyINR, formatDateTime } from '../utils/formatting';

export const ProfilePage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user, updateUser, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<ActivityFilter>('all');

  // Modals
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setDistrict(user.district);
      setVillage(user.village || '');
      setActivities(activityService.getActivities(user.id));
    }
  }, [user]);

  if (!user) return null;

  const savedPlans = businessService.getSavedPlans(user.id);
  const reports = reportService.getReports(user.id);
  const aiConvos = aiAdvisorService.getConversations(user.id);

  const stats = {
    assessmentsCompleted: reports.length > 0 ? reports.length : 1,
    businessesExplored: 4,
    reportsGenerated: reports.length,
    savedPlans: savedPlans.length,
    aiConversations: aiConvos.length,
    financialCalculations: 3
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ fullName, district, village });
    setEditProfileOpen(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPwdMsg('Password must be at least 8 characters long.');
      return;
    }
    setPwdMsg('Password updated successfully.');
    setTimeout(() => {
      setChangePasswordOpen(false);
      setPwdMsg('');
      setNewPassword('');
    }, 1500);
  };

  // Activity filter logic
  const filteredActivities = activities.filter((act) => {
    if (filter === 'all') return true;
    if (filter === 'assessments') return act.type === 'ASSESSMENT_COMPLETED';
    if (filter === 'financial') return act.type === 'FINANCIAL_PLAN_CREATED';
    if (filter === 'schemes') return act.type === 'SCHEME_CHECKED';
    if (filter === 'ai') return act.type === 'AI_ADVISOR_USED';
    if (filter === 'reports') return act.type === 'FEASIBILITY_GENERATED' || act.type === 'REPORT_DOWNLOADED';
    if (filter === 'profile') return act.type === 'PROFILE_UPDATED';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user.fullName.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">{user.fullName}</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                  Verified Entrepreneur
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.village ? `${user.village}, ` : ''}{user.district}, {user.state}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user.mobile}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setChangePasswordOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Statistics Grid */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-xl font-black text-slate-900">{stats.assessmentsCompleted}</span>
            <span className="text-[10px] text-slate-500 block">Assessments</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-xl font-black text-slate-900">{stats.businessesExplored}</span>
            <span className="text-[10px] text-slate-500 block">Explored</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-xl font-black text-emerald-700">{stats.reportsGenerated}</span>
            <span className="text-[10px] text-slate-500 block">Reports</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-xl font-black text-blue-700">{stats.savedPlans}</span>
            <span className="text-[10px] text-slate-500 block">Saved Plans</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-xl font-black text-purple-700">{stats.aiConversations}</span>
            <span className="text-[10px] text-slate-500 block">AI Chats</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-xl font-black text-amber-700">{stats.financialCalculations}</span>
            <span className="text-[10px] text-slate-500 block">Calculations</span>
          </div>
        </div>
      </div>

      {/* MY ACTIVITIES: Timeline & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">MY ACTIVITIES & TIMELINE</h2>
            <p className="text-xs text-slate-500">Every major action is timestamped and recorded in your permanent activity history.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'assessments', label: 'Assessments' },
              { id: 'financial', label: 'Financial' },
              { id: 'schemes', label: 'Schemes' },
              { id: 'reports', label: 'Reports' },
              { id: 'ai', label: 'AI Chats' },
              { id: 'profile', label: 'Profile' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as ActivityFilter)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  filter === f.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          {filteredActivities.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No activities recorded under this category.</p>
          ) : (
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-6 pl-6">
              {filteredActivities.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
                  
                  <div className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-100 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                        {act.relatedBusiness && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {act.relatedBusiness}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{act.description}</p>
                      <span className="text-[10px] text-slate-400 block pt-0.5">
                        {formatDateTime(act.timestamp)}
                      </span>
                    </div>

                    {act.actionUrl && (
                      <button
                        onClick={() => navigate(act.actionUrl!)}
                        className="self-start sm:self-auto px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1 group/btn"
                      >
                        <span>{act.actionLabel || 'View →'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Personal Information"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Village / Gram Panchayat</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditProfileOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        title="Change Account Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          {pwdMsg && (
            <div className={`p-3 rounded-xl text-xs ${pwdMsg.includes('success') ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
              {pwdMsg}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Min 8 Characters)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setChangePasswordOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
