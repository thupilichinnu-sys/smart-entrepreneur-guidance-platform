import React, { useState, useEffect } from 'react';
import { 
  Building2, ArrowRight, ArrowLeft, MapPin, Coins, Briefcase, 
  CheckCircle2, Sparkles, Navigation, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BUSINESS_CATEGORIES } from '../data/businessCatalog';
import { businessService } from '../services/businessService';
import { activityService } from '../services/activityService';
import { reportService } from '../services/reportService';
import { calculateProjectCost, selectScheme } from '../utils/financialEngine';
import { formatCurrencyINR } from '../utils/formatting';
import { ProgressBar } from '../components/ui/ProgressBar';
import { CurrencyInput } from '../components/ui/CurrencyInput';
import { AssessmentData } from '../types/assessment';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra',
  'Madhya Pradesh', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Gujarat'
];

export const AssessmentPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [stateName, setStateName] = useState('Andhra Pradesh');
  const [district, setDistrict] = useState('Sri Sathya Sai');
  const [block, setBlock] = useState('Penukonda');
  const [gramPanchayat, setGramPanchayat] = useState('Penukonda GP');
  const [village, setVillage] = useState('Kottapalli Ward 4');
  const [pinCode, setPinCode] = useState('515110');

  const [marginCapital, setMarginCapital] = useState(100000);
  const [category, setCategory] = useState('Dairy & Milk Products');
  const [experienceLevel, setExperienceLevel] = useState<'none' | '1-2_years' | '3-5_years' | '5+_years'>('1-2_years');
  const [skills, setSkills] = useState<string[]>(['Cattle Care', 'Milking Hygiene', 'Fodder Cultivation']);
  const [existingAssets, setExistingAssets] = useState<string[]>(['0.5 Acre Fodder Land', 'Semi-pucca Cattle Shed']);
  const [familyWorkforce, setFamilyWorkforce] = useState(2);
  const [targetMarket, setTargetMarket] = useState<'village_only' | 'cluster_5km' | 'district_10km' | 'regional'>('cluster_5km');

  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const existing = businessService.getAssessment(user.id);
      if (existing) {
        setStateName(existing.location.state || user.state || 'Andhra Pradesh');
        setDistrict(existing.location.district || user.district || '');
        setBlock(existing.location.block || '');
        setGramPanchayat(existing.location.gramPanchayat || '');
        setVillage(existing.location.village || '');
        setPinCode(existing.location.pinCode || '');
        setMarginCapital(existing.marginCapital || 100000);
        setCategory(existing.category || 'Dairy & Milk Products');
        setExperienceLevel(existing.experienceLevel || '1-2_years');
        setSkills(existing.skills || []);
        setExistingAssets(existing.existingAssets || []);
        setFamilyWorkforce(existing.familyWorkforce || 2);
        setTargetMarket(existing.targetMarket || 'cluster_5km');
      }
    }
  }, [user]);

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          // Set resolved coordinates
          setVillage('Current GPS Location Detected');
        },
        () => {
          setIsLocating(false);
          setVillage('Penukonda GP (Fallback)');
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const projectCost = calculateProjectCost(marginCapital);
  const schemeMatch = selectScheme(marginCapital);
  const progressPercent = Math.round((step / totalSteps) * 100);

  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleAsset = (asset: string) => {
    setExistingAssets(prev => prev.includes(asset) ? prev.filter(a => a !== asset) : [...prev, asset]);
  };

  const handleComplete = () => {
    if (!user) return;
    setIsSubmitting(true);

    const assessmentPayload: AssessmentData = {
      id: 'asm_' + Date.now(),
      userId: user.id,
      location: {
        state: stateName,
        district,
        block,
        gramPanchayat,
        village,
        pinCode
      },
      marginCapital,
      category,
      experienceLevel,
      skills,
      existingAssets,
      familyWorkforce,
      targetMarket,
      status: 'completed',
      updatedAt: new Date().toISOString(),
      progressPercent: 100
    };

    // 1. Save assessment
    businessService.saveAssessment(user.id, assessmentPayload);

    // 2. Generate Feasibility Report
    const report = businessService.generateFeasibilityReport(assessmentPayload);
    reportService.saveReport(user.id, report);

    // 3. Save as business plan in profile
    businessService.savePlan(user.id, {
      businessName: `${category} Enterprise`,
      category,
      location: `${village || gramPanchayat}, ${district}`,
      marginCapital,
      projectCost,
      loanAmount: schemeMatch.applicableLoan,
      schemeName: schemeMatch.scheme?.name || 'MoSJE Concessional Credit',
      feasibilityScore: report.overallScore,
      status: 'Ready'
    });

    // 4. Log activity
    activityService.logActivity(user.id, {
      type: 'ASSESSMENT_COMPLETED',
      title: 'Business Assessment Completed',
      description: `${category} in ${district} with ₹${(projectCost / 100000).toFixed(1)}L capacity.`,
      relatedBusiness: category,
      actionUrl: '/feasibility',
      actionLabel: 'View Report →'
    });

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/feasibility');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Wizard Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              {step}/{totalSteps}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {step === 1 ? 'Step 1: Location Profile' : step === 2 ? 'Step 2: Margin Capital' : step === 3 ? 'Step 3: Business Category' : 'Step 4: Experience & Skills'}
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-700">{progressPercent}% Completed</span>
        </div>
        <ProgressBar progress={progressPercent} showPercent={false} color="emerald" height="sm" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
        
        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Business Location Profile</h2>
                <p className="text-xs text-slate-500">Specify the Gram Panchayat or village cluster for hyper-local intelligence.</p>
              </div>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 flex items-center gap-2 transition-all self-start sm:self-auto"
              >
                <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting GPS...' : 'Use My Location'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State <span className="text-emerald-600">*</span></label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District <span className="text-emerald-600">*</span></label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Sri Sathya Sai"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Taluk / Block / Mandal</label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="e.g. Penukonda Mandal"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gram Panchayat</label>
                <input
                  type="text"
                  value={gramPanchayat}
                  onChange={(e) => setGramPanchayat(e.target.value)}
                  placeholder="e.g. Penukonda GP"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Village / Habitation / Ward</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Kottapalli Ward 4"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Postal PIN Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="e.g. 515110"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Margin Capital */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Available Margin Capital</h2>
              <p className="text-xs text-slate-500">
                Beneficiary contribution is 10%. Under MoSJE guidelines, your margin unlocks up to 90% debt financing.
              </p>
            </div>

            <CurrencyInput
              value={marginCapital}
              onChange={setMarginCapital}
              label="How much personal margin capital can you arrange?"
              helperText="Quick chips automatically populate common grassroots capital bands."
            />

            {/* Live Financial Projection Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Deterministic Financial Structuring
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 block">Calculated Project Cost</span>
                  <span className="text-base font-bold text-slate-900">{formatCurrencyINR(projectCost)}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Margin ÷ 0.10</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 block">Applicable 90% Loan</span>
                  <span className="text-base font-bold text-emerald-700">{formatCurrencyINR(schemeMatch.applicableLoan)}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {schemeMatch.cappedNotice ? 'Capped at Scheme Limit' : 'Full 90% of Cost'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 block">Matched Scheme</span>
                  <span className="text-sm font-bold text-purple-700 block truncate" title={schemeMatch.scheme?.name || ''}>
                    {schemeMatch.scheme?.name || 'Exceeds Limit'}
                  </span>
                  <span className="text-[10px] text-purple-600 block mt-0.5">
                    {schemeMatch.scheme ? `${schemeMatch.scheme.interestRate}% • ${schemeMatch.scheme.tenureYears} yrs` : 'Review Outlay'}
                  </span>
                </div>
              </div>

              {schemeMatch.cappedNotice && (
                <p className="text-[11px] text-amber-800 bg-amber-100/60 p-2 rounded-lg font-medium">
                  Notice: {schemeMatch.cappedNotice}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Business Category */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Select Business Category</h2>
              <p className="text-xs text-slate-500">Pick the primary grassroots enterprise you intend to establish.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
              {BUSINESS_CATEGORIES.map((b) => {
                const isSelected = category === b.name;
                return (
                  <div
                    key={b.id}
                    onClick={() => setCategory(b.name)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{b.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{b.tagline}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-700 font-semibold">{b.avgMarginNeeded}</span>
                      <span className="text-slate-400">{b.demandTrend} Demand</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Experience & Skills */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Experience, Assets & Readiness</h2>
              <p className="text-xs text-slate-500">Helps the AI score your operational resilience and debt-service capacity.</p>
            </div>

            <div className="space-y-4">
              {/* Experience level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Previous Experience in this Sector</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'none', label: 'Beginner / None' },
                    { id: '1-2_years', label: '1 - 2 Years' },
                    { id: '3-5_years', label: '3 - 5 Years' },
                    { id: '5+_years', label: '5+ Years' }
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setExperienceLevel(exp.id as any)}
                      className={`p-2.5 rounded-xl border font-semibold transition-all ${
                        experienceLevel === exp.id 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Core Skills & Capabilities</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Cattle Care', 'Milking Hygiene', 'Fodder Cultivation', 
                    'Basic Bookkeeping', 'Local Customer Network', 'Digital Payments',
                    'Machinery Maintenance', 'Food Safety Awareness', 'Marketing'
                  ].map((sk) => {
                    const active = skills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleSkill(sk)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          active 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {active ? `✓ ${sk}` : `+ ${sk}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Existing Assets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Existing Assets & Facilities</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    '0.5 Acre Fodder Land', 'Semi-pucca Cattle Shed', 'Borewell / Water Supply',
                    'Two-wheeler with milk crates', 'Solar Power Backup', 'Storage Godown'
                  ].map((ast) => {
                    const active = existingAssets.includes(ast);
                    return (
                      <button
                        key={ast}
                        type="button"
                        onClick={() => toggleAsset(ast)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          active 
                            ? 'bg-blue-50 text-blue-800 border-blue-300' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {active ? `✓ ${ast}` : `+ ${ast}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Customer Radius */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Family Workforce Available</label>
                  <select
                    value={familyWorkforce}
                    onChange={(e) => setFamilyWorkforce(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value={1}>1 Person (Solo)</option>
                    <option value={2}>2 Family Members</option>
                    <option value={3}>3 Family Members</option>
                    <option value={4}>4+ Family Members</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Sales Radius</label>
                  <select
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="village_only">Within Same Village Only</option>
                    <option value="cluster_5km">5 km Cluster Radius (Recommended)</option>
                    <option value="district_10km">10 km Surrounding Mandi Zone</option>
                    <option value="regional">Regional / Commercial Supply</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={isSubmitting}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Generating AI Feasibility...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Feasibility Report →</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
