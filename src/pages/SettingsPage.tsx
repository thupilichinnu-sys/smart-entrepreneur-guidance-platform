import React, { useState } from 'react';
import { 
  Settings, KeyRound, Globe, Wifi, ShieldAlert, Download, 
  Trash2, CheckCircle2, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { storageService } from '../services/storageService';
import { Language } from '../types/auth';

export const SettingsPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, lowDataMode, toggleLowDataMode } = useLanguage();

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) return null;

  const handleExportData = () => {
    const data = storageService.exportUserData(user.id);
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', jsonStr);
    a.setAttribute('download', `segp_user_backup_${user.id}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setSuccessMsg('User data backup exported successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteAccount = () => {
    storageService.deleteUserData(user.id);
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">ACCOUNT SETTINGS</h1>
        <p className="text-xs text-slate-500">Manage security, language preferences, and data privacy.</p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Language & Accessibility */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>Language & Accessibility</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Low Data Mode</span>
              <span className="text-[10px] text-slate-500">Reduces animations & heavy map layers.</span>
            </div>
            <button
              onClick={toggleLowDataMode}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 ${lowDataMode ? 'bg-emerald-600' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${lowDataMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>Data & Privacy</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your private data is isolated under your user ID. You can download an offline JSON backup or permanently wipe your records at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export My Data (JSON)</span>
          </button>

          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Delete My Account</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-700 font-bold">Are you sure?</span>
              <button
                onClick={handleDeleteAccount}
                className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Session Management */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Session Controls</h3>
        <p className="text-xs text-slate-500">Sign out of your current session.</p>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Current Device</span>
        </button>
      </div>

    </div>
  );
};
