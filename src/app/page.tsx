'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore, useAuthStore } from '@/lib/store';

// Screen imports
import SplashScreen from '@/components/medpac/splash-screen';
import OnboardingScreen from '@/components/medpac/onboarding-screen';
import QuizScreen from '@/components/medpac/quiz-screen';
import LoginScreen from '@/components/medpac/login-screen';
import OTPScreen from '@/components/medpac/otp-screen';
import HomeScreen from '@/components/medpac/home-screen';
import AIAssistantScreen from '@/components/medpac/ai-assistant-screen';
import MedicineScreen from '@/components/medpac/medicine-screen';
import MedicineDetailScreen from '@/components/medpac/medicine-detail-screen';
import CartScreen from '@/components/medpac/cart-screen';
import PrescriptionScreen from '@/components/medpac/prescription-screen';
import FamilyScreen from '@/components/medpac/family-screen';
import HealthVaultScreen from '@/components/medpac/health-vault-screen';
import ReportAnalyzerScreen from '@/components/medpac/report-analyzer-screen';
import ReminderScreen from '@/components/medpac/reminder-screen';
import TelemedicineScreen from '@/components/medpac/telemedicine-screen';
import DiagnosticsScreen from '@/components/medpac/diagnostics-screen';
import SubscriptionScreen from '@/components/medpac/subscription-screen';
import ProfileScreen from '@/components/medpac/profile-screen';
import SettingsScreen from '@/components/medpac/settings-screen';
import NotificationsScreen from '@/components/medpac/notifications-screen';
import BottomNav from '@/components/medpac/bottom-nav';

// Screens that should show bottom navigation
const AUTHENTICATED_SCREENS = [
  'home', 'ai-assistant', 'medicine', 'medicine-detail', 'cart',
  'prescription', 'family', 'health-vault', 'report-analyzer',
  'reminders', 'telemedicine', 'diagnostics', 'subscriptions',
  'profile', 'settings', 'notifications'
];

export default function Home() {
  const { screen } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  const showBottomNav = isAuthenticated && AUTHENTICATED_SCREENS.includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'quiz':
        return <QuizScreen />;
      case 'login':
        return <LoginScreen />;
      case 'otp':
        return <OTPScreen />;
      case 'home':
        return <HomeScreen />;
      case 'ai-assistant':
        return <AIAssistantScreen />;
      case 'medicine':
        return <MedicineScreen />;
      case 'medicine-detail':
        return <MedicineDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'prescription':
        return <PrescriptionScreen />;
      case 'family':
        return <FamilyScreen />;
      case 'health-vault':
        return <HealthVaultScreen />;
      case 'report-analyzer':
        return <ReportAnalyzerScreen />;
      case 'reminders':
        return <ReminderScreen />;
      case 'telemedicine':
        return <TelemedicineScreen />;
      case 'diagnostics':
        return <DiagnosticsScreen />;
      case 'subscriptions':
        return <SubscriptionScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
