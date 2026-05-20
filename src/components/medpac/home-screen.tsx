'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Pill,
  TestTube,
  Stethoscope,
  Shield,
  FileUp,
  Bell,
  Lightbulb,
  Clock,
  ChevronRight,
  FileText,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Screen } from '@/lib/types';
import {
  useAppStore,
  useAuthStore,
  useQuizStore,
  useNotificationStore,
  useReminderStore,
  usePrescriptionStore,
} from '@/lib/store';

// ─── Animation Variants ──────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

// ─── Health Score Ring ───────────────────────────────────────
function HealthScoreRing({ score }: { score: number }) {
  const radius = 54;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        {/* Background circle */}
        <circle
          stroke="oklch(0.93 0.03 165)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <motion.circle
          stroke="oklch(0.55 0.15 170)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-teal-700 dark:text-teal-400"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Health Score
        </span>
      </div>
    </div>
  );
}

// ─── Quick Action Button ─────────────────────────────────────
function QuickAction({
  icon: Icon,
  label,
  bgClass,
  screen,
}: {
  icon: React.ElementType;
  label: string;
  bgClass: string;
  screen: Screen;
}) {
  const setScreen = useAppStore((s) => s.setScreen);

  return (
    <motion.button
      variants={itemVariants}
      whileTap={{ scale: 0.93 }}
      onClick={() => setScreen(screen)}
      className="flex flex-col items-center gap-2 rounded-2xl p-3 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`Navigate to ${label}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${bgClass}`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-xs font-medium text-foreground leading-tight text-center">
        {label}
      </span>
    </motion.button>
  );
}

// ─── Main Home Screen ────────────────────────────────────────
export default function HomeScreen() {
  const setScreen = useAppStore((s) => s.setScreen);
  const user = useAuthStore((s) => s.user);
  const { quizCompleted, quizData } = useQuizStore();
  const { notifications, unreadCount } = useNotificationStore();
  const { reminders } = useReminderStore();
  const { prescriptions } = usePrescriptionStore();

  const unread = unreadCount();

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const userName = user?.name || 'Rahul';

  // Active reminders (up to 3)
  const activeReminders = reminders.filter((r) => r.isActive).slice(0, 3);

  return (
    <motion.div
      className="min-h-screen bg-background text-on-background font-body-md antialiased md:flex md:justify-center pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header App Bar */}
        <header className="bg-white dark:bg-card border-b border-border/40 sticky top-0 w-full z-50 flex justify-between items-center px-4 h-16 md:shadow-none">
          <button 
            onClick={() => setScreen('profile')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors cursor-pointer active:scale-95"
            aria-label="Profile"
          >
            <Avatar className="h-8 w-8 border border-border shadow-sm">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={userName} />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-xs font-medium">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          <div className="flex items-center justify-center cursor-pointer" onClick={() => setScreen('home')}>
            <img 
              alt="MedPac Logo" 
              className="h-8 object-contain" 
              src="/logo.svg"
            />
          </div>
          <button 
            onClick={() => setScreen('notifications')}
            className="relative text-on-surface-variant hover:bg-muted transition-colors p-2 rounded-full cursor-pointer active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined align-middle">notifications</span>
            {unread > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {unread}
              </span>
            )}
          </button>
        </header>

        {/* Main Content container */}
        <main className="pt-4 px-4 w-full md:grid md:grid-cols-12 md:gap-6">
          {/* Main Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Welcome Section */}
            <section className="mt-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {greeting}, {userName} 👋
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Let's manage your health today.
              </p>
            </section>

            {/* AI Assistant Banner */}
            <section>
              <div className="bg-gradient-to-br from-primary-container to-primary/80 dark:from-primary/30 dark:to-primary-container/20 rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center gap-6 border border-primary/10">
                <div className="flex-1 text-on-primary-container dark:text-foreground z-10">
                  <h2 className="text-xl md:text-2xl font-bold mb-2 text-white dark:text-white">Ask AI Health Assistant</h2>
                  <p className="text-sm mb-6 text-white/90 dark:text-foreground/90">Get answers, guidance &amp; health tips instantly.</p>
                  <button 
                    onClick={() => setScreen('ai-assistant')}
                    className="bg-[#0ba68c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#0ba68c]/90 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    Ask Now
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
                <div className="z-10 w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/20 dark:bg-card/30 backdrop-blur-sm flex items-center justify-center shadow-inner">
                  <img 
                    alt="AI Assistant avatar" 
                    className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-xl" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD1iZtqyD82UO-x6GXB3E4PxnBhAKKatWJmWao4LCmu0dMZdRQVJIIX7tzOibw8xngBllT2khmf3s9q5iAq4nFq9HAxFbDQA4B8jrbSGrFzF8stx5vT76PPQZ4IpPP6l5rLrcr4UmsViCNuaDFj3MTDTpjV4HYiS17CL0dcLa4ED5I55fGpl4u0E-ASkK9jmsf12_RjZ_J_KQyB5Ba3LBE2lSN1t-fx917LdKwHgOsTRrXhK_olwLt8sDUfvnJmHwPSQpRyJApg8s"
                  />
                </div>
                {/* Decorative background elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/30 rounded-full blur-xl"></div>
              </div>
            </section>

            {/* Quick Actions Grid */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold text-foreground">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <QuickAction
                  icon={Brain}
                  label="AI Assistant"
                  bgClass="bg-gradient-to-br from-teal-500 to-teal-600"
                  screen="ai-assistant"
                />
                <QuickAction
                  icon={Pill}
                  label="Medicines"
                  bgClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
                  screen="medicine"
                />
                <QuickAction
                  icon={TestTube}
                  label="Diagnostics"
                  bgClass="bg-gradient-to-br from-cyan-500 to-cyan-600"
                  screen="diagnostics"
                />
                <QuickAction
                  icon={Stethoscope}
                  label="Consult"
                  bgClass="bg-gradient-to-br from-green-500 to-green-600"
                  screen="telemedicine"
                />
                <QuickAction
                  icon={Shield}
                  label="Vault"
                  bgClass="bg-gradient-to-br from-amber-500 to-amber-600"
                  screen="health-vault"
                />
                <QuickAction
                  icon={FileUp}
                  label="Analyzer"
                  bgClass="bg-gradient-to-br from-purple-500 to-purple-600"
                  screen="report-analyzer"
                />
              </div>
            </section>

            {/* Health Overview */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold text-foreground">Health Overview</h2>
                <button onClick={() => setScreen('report-analyzer')} className="text-primary text-xs font-semibold hover:underline cursor-pointer">View All</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {/* Medicines Card */}
                <div className="bg-card dark:bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col items-center text-center">
                  <span className="text-2xl font-bold text-foreground mb-1">2</span>
                  <span className="text-xs font-medium text-muted-foreground">Medicines</span>
                  <span className="text-[10px] text-muted-foreground/75 mt-0.5">Due Today</span>
                </div>
                {/* Refill Card */}
                <div className="bg-card dark:bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col items-center text-center">
                  <span className="text-2xl font-bold text-foreground mb-1">1</span>
                  <span className="text-xs font-medium text-muted-foreground">Refill</span>
                  <span className="text-[10px] text-destructive font-semibold mt-0.5">Due</span>
                </div>
                {/* Reports Card */}
                <div className="bg-card dark:bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-6 h-6 bg-primary/10 rounded-bl-xl"></div>
                  <span className="text-2xl font-bold text-foreground mb-1">2</span>
                  <span className="text-xs font-medium text-muted-foreground">Reports</span>
                  <span className="text-[10px] text-primary font-bold mt-0.5">New</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Reminders Column */}
          <div className="md:col-span-4 lg:col-span-3 space-y-6 mt-6 md:mt-0">
            <section className="bg-muted/40 dark:bg-muted/10 rounded-2xl p-4 border border-border/40 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-foreground">Upcoming Reminders</h2>
                <span className="material-symbols-outlined text-muted-foreground text-lg">notifications</span>
              </div>
              
              {activeReminders.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground bg-card dark:bg-card rounded-xl p-4 border border-border/40">
                  <span className="material-symbols-outlined text-muted-foreground/60 text-2xl mb-1 block">notifications_off</span>
                  No reminders left for today.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeReminders.map((reminder) => (
                    <div 
                      key={reminder.id}
                      className="bg-card dark:bg-card rounded-xl p-3.5 flex items-center gap-3 border border-border/40 hover:border-border transition-colors shadow-sm"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-lg">medication</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-foreground truncate">{reminder.medicineName}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{reminder.dosage} &bull; {reminder.times.join(', ')}</p>
                      </div>
                      <button 
                        onClick={() => setScreen('medicine')}
                        className="text-primary text-[10px] font-bold hover:underline shrink-0"
                      >
                        Take
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
