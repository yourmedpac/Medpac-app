'use client';

import { motion } from 'framer-motion';
import { House, Pill, Brain, Activity, User } from 'lucide-react';
import type { Screen } from '@/lib/types';
import { useAppStore } from '@/lib/store';

// ─── Nav Items Config ────────────────────────────────────────
interface NavItem {
  id: Screen;
  label: string;
  icon: React.ElementType;
  isCenter?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'medicine', label: 'Medicines', icon: Pill },
  { id: 'ai-assistant', label: 'AI', icon: Brain, isCenter: true },
  { id: 'health-vault', label: 'Health', icon: Activity },
  { id: 'profile', label: 'Profile', icon: User },
];

// ─── Individual Nav Button ───────────────────────────────────
function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  if (item.isCenter) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="relative flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Pulse ring animation behind the button */}
        <div className="pulse-ring relative">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 shadow-xl shadow-teal-500/40"
          >
            <Brain className="h-6 w-6 text-white" />
          </motion.div>
        </div>
        <span
          className={`mt-1 text-[10px] font-semibold ${
            isActive
              ? 'text-teal-600 dark:text-teal-400'
              : 'text-muted-foreground'
          }`}
        >
          {item.label}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-0.5 min-h-[40px] min-w-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <motion.div whileTap={{ scale: 0.85 }} className="flex items-center justify-center h-10 w-10 rounded-xl transition-colors">
        <Icon
          className={`h-5 w-5 transition-colors ${
            isActive
              ? 'text-teal-600 dark:text-teal-400'
              : 'text-muted-foreground'
          }`}
          fill={isActive ? 'currentColor' : 'none'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </motion.div>
      <span
        className={`text-[10px] font-medium transition-colors ${
          isActive
            ? 'text-teal-600 dark:text-teal-400'
            : 'text-muted-foreground'
        }`}
      >
        {item.label}
      </span>
    </button>
  );
}

// ─── Bottom Nav Component ────────────────────────────────────
export default function BottomNav() {
  const screen = useAppStore((s) => s.screen);
  const setScreen = useAppStore((s) => s.setScreen);

  // Determine which tab is active
  const getActiveTab = (id: Screen): boolean => {
    if (id === 'home') return screen === 'home';
    if (id === 'medicine') return screen === 'medicine' || screen === 'medicine-detail' || screen === 'cart';
    if (id === 'ai-assistant') return screen === 'ai-assistant';
    if (id === 'health-vault') return screen === 'health-vault' || screen === 'diagnostics' || screen === 'report-analyzer' || screen === 'reminders';
    if (id === 'profile') return screen === 'profile' || screen === 'settings' || screen === 'family' || screen === 'notifications' || screen === 'subscriptions';
    return false;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] rounded-t-2xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Main navigation"
    >
      <div className="max-w-lg mx-auto flex items-end justify-around px-2 pt-2 pb-2">
        {NAV_ITEMS.map((item) => {
          // The AI center button is elevated above the bar
          if (item.isCenter) {
            return (
              <div key={item.id} className="relative -mt-5">
                <NavButton
                  item={item}
                  isActive={getActiveTab(item.id)}
                  onClick={() => setScreen(item.id)}
                />
              </div>
            );
          }

          return (
            <NavButton
              key={item.id}
              item={item}
              isActive={getActiveTab(item.id)}
              onClick={() => setScreen(item.id)}
            />
          );
        })}
      </div>
    </nav>
  );
}
