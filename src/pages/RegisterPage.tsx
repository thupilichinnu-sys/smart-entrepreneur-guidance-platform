import React, { useState } from 'react';
import { Building2, ArrowRight, Lock, Mail, Phone, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { validateFullName, validateIndianMobile, validateEmail, evaluatePasswordStrength } from '../utils/validation';
import { Language } from '../types/auth';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra',
  'Madhya Pradesh', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Gujarat',
  'Odisha', 'West Bengal', 'Punjab', 'Haryana', 'Assam'
];

export const RegisterPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { register } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: 'Andhra Pradesh',
    district: '',
    village: '',
    preferredLanguage: 'en' as Language
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const pwdStrength = evaluatePasswordStrength(formData.password);

  const handleChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const nameCheck = validateFullName(formData.fullName);
    if (!nameCheck.isValid) newErrors.fullName = nameCheck.error || 'Invalid name';

    const mobileCheck = validateIndianMobile(formData.mobile);
    if (!mobileCheck.isValid) newErrors.mobile = mobileCheck.error || 'Invalid mobile';

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) newErrors.email = emailCheck.error || 'Invalid email';

    if (!pwdStrength.hasMinLength) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!pwdStrength.hasUpper || !pwdStrength.hasLower || !pwdStrength.hasNumber) {
      newErrors.password = 'Must include uppercase, lowercase, and a number.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.state) newErrors.state = 'State is required.';
    if (!formData.district.trim()) newErrors.district = 'District is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const res = await register(formData);
    setIsLoading(false);

    if (res.success) {
      navigate('/onboarding');
    } else {
      setErrors({ form: res.error || 'Account creation failed.' });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Start building your personalized business roadmap.
          </p>
        </div>

        {errors.form && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Full Name <span className="text-emerald-600">*</span>
            </label>
            <div className="relative rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.fullName ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                }`}
              />
            </div>
            {errors.fullName && <p className="text-[11px] text-red-600 font-medium">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Mobile Number <span className="text-emerald-600">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  placeholder="+919876543210"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.mobile ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                  }`}
                />
              </div>
              {errors.mobile && <p className="text-[11px] text-red-600 font-medium">{errors.mobile}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address <span className="text-emerald-600">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="ramesh@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-600 font-medium">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Password <span className="text-emerald-600">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Min 8 characters"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                  }`}
                />
              </div>

              {formData.password && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Strength:</span>
                    <span className={`font-bold ${
                      pwdStrength.label === 'Strong' ? 'text-emerald-600' : pwdStrength.label === 'Medium' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {pwdStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        pwdStrength.label === 'Strong' ? 'w-full bg-emerald-500' : pwdStrength.label === 'Medium' ? 'w-2/3 bg-amber-500' : 'w-1/3 bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-[11px] text-red-600 font-medium">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Confirm Password <span className="text-emerald-600">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-red-600 font-medium">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                State <span className="text-emerald-600">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {INDIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                District <span className="text-emerald-600">*</span>
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="e.g. Sri Sathya Sai"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.district ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                }`}
              />
              {errors.district && <p className="text-[11px] text-red-600 font-medium">{errors.district}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Village / Gram Panchayat <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => handleChange('village', e.target.value)}
                placeholder="e.g. Penukonda GP"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Preferred Language
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => handleChange('preferredLanguage', e.target.value as Language)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 pt-3"
          >
            {isLoading ? <span>Creating Account...</span> : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          <span>Already have an account? </span>
          <button
            onClick={() => navigate('/login')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
