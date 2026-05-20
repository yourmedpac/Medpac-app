'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  FileText,
  Calendar,
  Info,
  CheckCheck,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Notification } from '@/lib/types';
import { useAppStore, useNotificationStore } from '@/lib/store';

// ─── Animation Variants ──────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
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

// ─── Filter Tabs ─────────────────────────────────────────────
type FilterTab = 'all' | 'reminder' | 'report' | 'appointment' | 'system';

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'reminder', label: 'Reminders' },
  { value: 'report', label: 'Reports' },
  { value: 'appointment', label: 'Appointments' },
  { value: 'system', label: 'System' },
];

// ─── Sample Notifications ────────────────────────────────────
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Medicine Reminder',
    message: 'Time to take your Metformin 500mg',
    type: 'reminder',
    read: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Report Ready',
    message: 'Your blood test results are ready for review',
    type: 'report',
    read: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n3',
    title: 'Appointment Tomorrow',
    message: 'You have a consultation with Dr. Sharma at 10:00 AM',
    type: 'appointment',
    read: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

// ─── Relative Time ───────────────────────────────────────────
function getRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

// ─── Notification Icon ───────────────────────────────────────
function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'reminder':
      return <Bell className="h-4 w-4" />;
    case 'report':
      return <FileText className="h-4 w-4" />;
    case 'appointment':
      return <Calendar className="h-4 w-4" />;
    case 'system':
    case 'promotion':
    default:
      return <Info className="h-4 w-4" />;
  }
}

function getNotificationIconBg(type: Notification['type']) {
  switch (type) {
    case 'reminder':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400';
    case 'report':
      return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400';
    case 'appointment':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400';
    case 'system':
    case 'promotion':
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400';
  }
}

function getNotificationScreen(type: Notification['type']) {
  switch (type) {
    case 'reminder':
      return 'reminders' as const;
    case 'report':
      return 'health-vault' as const;
    case 'appointment':
      return 'telemedicine' as const;
    default:
      return null;
  }
}

// ─── Notifications Screen Component ──────────────────────────
export default function NotificationsScreen() {
  const { goBack, setScreen } = useAppStore();
  const { notifications, addNotification, markRead, markAllRead } =
    useNotificationStore();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  // Add sample notifications on mount if empty
  useEffect(() => {
    if (notifications.length === 0) {
      SAMPLE_NOTIFICATIONS.forEach((n) => addNotification(n));
    }
  }, []);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  // Handle notification tap
  const handleNotificationTap = useCallback(
    (notification: Notification) => {
      if (!notification.read) {
        markRead(notification.id);
      }
      const targetScreen = getNotificationScreen(notification.type);
      if (targetScreen) {
        setScreen(targetScreen);
      }
    },
    [markRead, setScreen]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white via-slate-50/20 to-gray-50/10 dark:from-gray-950 dark:via-slate-950/5 dark:to-gray-950/5 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-border/40"
      >
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* ─── Main Content ───────────────────────────────────── */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* ─── Filter Tabs ───────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  activeFilter === tab.value
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* ─── Notification List ─────────────────────────────── */}
        <motion.section variants={itemVariants} aria-label="Notifications">
          {filteredNotifications.length === 0 ? (
            /* ─── Empty State ──────────────────────────────────── */
            <Card className="border-dashed border-border/60 bg-muted/30 dark:bg-muted/10">
              <CardContent className="py-12 text-center">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-muted/60 mb-3">
                  <Bell className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  No notifications yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  We&apos;ll notify you about reminders, reports, and updates
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 24,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`border-border/40 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
                        !notification.read
                          ? 'border-l-4 border-l-emerald-400 dark:border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                          : 'bg-white dark:bg-gray-950'
                      }`}
                      onClick={() => handleNotificationTap(notification)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleNotificationTap(notification);
                        }
                      }}
                      aria-label={`${notification.read ? '' : 'Unread: '}${notification.title}`}
                    >
                      <CardContent className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getNotificationIconBg(
                              notification.type
                            )}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3
                                className={`text-sm leading-tight ${
                                  !notification.read
                                    ? 'font-bold text-foreground'
                                    : 'font-medium text-foreground/80'
                                }`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 mt-1.5">
                              <Clock className="h-3 w-3 text-muted-foreground/60" />
                              <span className="text-[10px] text-muted-foreground/60 font-medium">
                                {getRelativeTime(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>

        <div className="h-4" />
      </main>
    </motion.div>
  );
}
