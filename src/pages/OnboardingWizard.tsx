import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, MapPin, Coins, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import { CurrencyInput } from '../components/ui/CurrencyInput';
import { BUSINESS_CATEGORIES } from '../data/businessCatalog';
import { businessService } from '../services/businessService';
import { calculateProjectCost } from '../utils/financialEngine';

export const OnboardingWizard: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState(1);
  const [locationState, setLocationState] = useState(user?.state || 'Andhra Pradesh');
  const [district, setDistrict] = useState(user?.district || '');
  const [village, setVillage] = useState(user?.village || '');
  const [marginCapital, setMarginCapital] = useState(100000);
  const [selectedCategory, setSelectedCategory] = useState('Dairy & Milk Products');

  const totalSteps = 5;
  const progressPercent = Math.round((step / totalSteps) * 100);

  const handleFinish = () => {
    if (user) {
      updateUser({
        state: locationState,
        district,
        village,
        marginCapital
      });

      businessService.saveAssessment(user.id, {
        userId: user.id,
        location: { state: locationState, district, village },
        marginCapital,
        category: selectedCategory,
        experienceLevel: '1-2_years',
        skills: ['General Business', 'Local Knowledge'],
        existingAssets: [],
        familyWorkforce: 2,
        targetMarket: 'cluster_5km',
        status: 'draft',
        updatedAt: new Date().toISOString(),
        progressPercent: 40
      });
    }

    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center">
              {step}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {step} of {totalSteps}</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Skip for Now →
          </button>
        </div>

        <ProgressBar progress={progressPercent} showPercent={false} color="emerald" height="sm" />

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Welcome to Smart Entrepreneur Guidance Platform!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hello {user?.fullName || 'Entrepreneur'}! Let’s set up your personalized profile to unlock tailored local business recommendations, financial structures, and MoSJE scheme guidance.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <p><b>Name:</b> {user?.fullName}</p>
              <p><b>Mobile:</b> {user?.mobile}</p>
              <p><b>Email:</b> {user?.email}</p>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Where do you want to start your business?
            </h2>
            <p className="text-xs text-slate-500">
              Local market intelligence adapts to your Gram Panchayat and district conditions.
            </p>
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={locationState}
                  onChange={(e) => setLocationState(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Sri Sathya Sai"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gram Panchayat / Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Penukonda GP"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-600" />
              Tell us your available margin capital
            </h2>
            <p className="text-xs text-slate-500">
              Under MoSJE guidelines, your 10% contribution unlocks up to 90% institutional financing.
            </p>
            <div className="pt-2">
              <CurrencyInput
                value={marginCapital}
                onChange={setMarginCapital}
                helperText="Select or enter how much margin money you can arrange."
              />
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-emerald-900 font-semibold">Estimated Project Capacity:</span>
                  <span className="font-bold text-emerald-950">₹{calculateProjectCost(marginCapital).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-900 font-semibold">Potential 90% Financing:</span>
                  <span className="font-bold text-emerald-950">₹{(calculateProjectCost(marginCapital) * 0.9).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              What business interests you?
            </h2>
            <p className="text-xs text-slate-500">
              Select an initial sector. You can explore or compare others anytime.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
              {BUSINESS_CATEGORIES.slice(0, 9).map((cat) => {
                const isSel = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                      isSel 
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-semibold line-clamp-1">{cat.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{cat.avgMarginNeeded}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-display">
              Your Personalized Workspace is Ready!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              We’ve configured your initial dashboard for <b>{selectedCategory}</b> in <b>{district || 'your area'}</b> with an estimated project capacity of <b>₹{calculateProjectCost(marginCapital).toLocaleString('en-IN')}</b>.
            </p>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <span>Open My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
