import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { SearchModal } from './components/common/SearchModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { BusinessDiscoveryPage } from './pages/BusinessDiscoveryPage';
import { FeasibilityPage } from './pages/FeasibilityPage';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { FinancialPlannerPage } from './pages/FinancialPlannerPage';
import { SchemeRouterPage } from './pages/SchemeRouterPage';
import { RepaymentPage } from './pages/RepaymentPage';
import { ActionPlanPage } from './pages/ActionPlanPage';
import { CompareBusinessesPage } from './pages/CompareBusinessesPage';
import { BusinessPlanBuilderPage } from './pages/BusinessPlanBuilderPage';
import { AIAdvisorPage } from './pages/AIAdvisorPage';
import { ReportsPage } from './pages/ReportsPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/assessment',
  '/business-discovery',
  '/feasibility',
  '/financial-planner',
  '/repayment',
  '/action-plan',
  '/business-plan',
  '/ai-advisor',
  '/reports',
  '/activities',
  '/profile',
  '/settings'
];

const MainRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Custom hash/path routing for client-side persistence
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/';
  });

  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = (route: string) => {
    // Protected route check
    if (PROTECTED_ROUTES.includes(route) && !isAuthenticated) {
      setCurrentRoute('/login');
      window.location.hash = '/login';
      return;
    }

    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      if (PROTECTED_ROUTES.includes(hash) && !isAuthenticated && !isLoading) {
        navigate('/login');
      } else {
        setCurrentRoute(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, isLoading]);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Protected route guard during active render
  const isProtected = PROTECTED_ROUTES.includes(currentRoute);
  if (isProtected && !isAuthenticated && !isLoading) {
    return <LoginPage navigate={navigate} />;
  }

  const renderPage = () => {
    switch (currentRoute) {
      case '/':
        return <LandingPage navigate={navigate} />;
      case '/login':
        return <LoginPage navigate={navigate} />;
      case '/register':
        return <RegisterPage navigate={navigate} />;
      case '/forgot-password':
        return <ForgotPasswordPage navigate={navigate} />;
      case '/onboarding':
        return <OnboardingWizard navigate={navigate} />;
      case '/dashboard':
        return <DashboardPage navigate={navigate} />;
      case '/assessment':
        return <AssessmentPage navigate={navigate} />;
      case '/business-discovery':
        return <BusinessDiscoveryPage navigate={navigate} />;
      case '/market-intelligence':
        return <MarketIntelligencePage navigate={navigate} />;
      case '/feasibility':
        return <FeasibilityPage navigate={navigate} />;
      case '/financial-planner':
        return <FinancialPlannerPage navigate={navigate} />;
      case '/scheme-router':
        return <SchemeRouterPage navigate={navigate} />;
      case '/repayment':
        return <RepaymentPage navigate={navigate} />;
      case '/action-plan':
        return <ActionPlanPage navigate={navigate} />;
      case '/compare':
        return <CompareBusinessesPage navigate={navigate} />;
      case '/business-plan':
        return <BusinessPlanBuilderPage navigate={navigate} />;
      case '/ai-advisor':
        return <AIAdvisorPage navigate={navigate} />;
      case '/reports':
        return <ReportsPage navigate={navigate} />;
      case '/activities':
        return <ActivitiesPage navigate={navigate} />;
      case '/profile':
        return <ProfilePage navigate={navigate} />;
      case '/settings':
        return <SettingsPage navigate={navigate} />;
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <DisclaimerBanner />
      
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        openSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1 pb-16 md:pb-0">
        {renderPage()}
      </main>

      <Footer navigate={navigate} />

      <MobileBottomNav
        currentRoute={currentRoute}
        navigate={navigate}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        navigate={navigate}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <MainRouter />
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
