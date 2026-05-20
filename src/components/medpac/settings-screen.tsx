'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  Pill,
  Calendar,
  Lightbulb,
  Tag,
  Fingerprint,
  Share2,
  KeyRound,
  Globe,
  Type,
  Download,
  Trash2,
  Info,
  Star,
  Share,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Screen } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

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

// ─── Settings Toggle Row ─────────────────────────────────────
function SettingsToggle({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

// ─── Settings Action Row ─────────────────────────────────────
function SettingsAction({
  icon: Icon,
  label,
  description,
  onClick,
  destructive,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        destructive
          ? 'hover:bg-red-50 dark:hover:bg-red-950/30'
          : 'hover:bg-muted/50'
      }`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 ${
          destructive
            ? 'text-red-500 dark:text-red-400'
            : 'text-muted-foreground'
        }`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${
            destructive
              ? 'text-red-600 dark:text-red-400'
              : 'text-foreground'
          }`}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </motion.button>
  );
}

// ─── Settings Screen Component ───────────────────────────────
export default function SettingsScreen() {
  const { goBack } = useAppStore();

  // Notification toggles
  const [medicineReminders, setMedicineReminders] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [healthTips, setHealthTips] = useState(false);
  const [promoOffers, setPromoOffers] = useState(false);

  // Privacy toggles
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  // Preferences
  const [language, setLanguage] = useState('english');
  const [fontSize, setFontSize] = useState('medium');

  // Clear data dialog
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleToggle = (label: string, value: boolean) => {
    toast({
      title: 'Setting Updated',
      description: `${label} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Exporting Data',
      description: 'Preparing your health data export...',
    });
  };

  const handleClearData = () => {
    setClearDialogOpen(false);
    toast({
      title: 'Data Cleared',
      description: 'All app data has been cleared.',
    });
  };

  const handleChangePIN = () => {
    toast({
      title: 'Coming Soon',
      description: 'PIN setup coming soon',
    });
  };

  const handleRateUs = () => {
    toast({
      title: 'Thank you!',
      description: 'Redirecting to app store...',
    });
  };

  const handleShareApp = () => {
    toast({
      title: 'Share Medpac',
      description: 'Sharing link copied to clipboard!',
    });
  };

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
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-lg font-bold text-foreground">Settings</h1>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ─── Main Content ───────────────────────────────────── */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* ─── Notifications ─────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Bell className="h-3.5 w-3.5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-1">
              <SettingsToggle
                icon={Pill}
                label="Medicine Reminders"
                description="Get reminders for your medications"
                checked={medicineReminders}
                onCheckedChange={(v) => {
                  setMedicineReminders(v);
                  handleToggle('Medicine Reminders', v);
                }}
              />
              <Separator className="mx-4 bg-border/40" />
              <SettingsToggle
                icon={Calendar}
                label="Appointment Reminders"
                description="Reminders for upcoming appointments"
                checked={appointmentReminders}
                onCheckedChange={(v) => {
                  setAppointmentReminders(v);
                  handleToggle('Appointment Reminders', v);
                }}
              />
              <Separator className="mx-4 bg-border/40" />
              <SettingsToggle
                icon={Lightbulb}
                label="Health Tips"
                description="Daily health tips and articles"
                checked={healthTips}
                onCheckedChange={(v) => {
                  setHealthTips(v);
                  handleToggle('Health Tips', v);
                }}
              />
              <Separator className="mx-4 bg-border/40" />
              <SettingsToggle
                icon={Tag}
                label="Promotional Offers"
                description="Deals and discounts on medicines"
                checked={promoOffers}
                onCheckedChange={(v) => {
                  setPromoOffers(v);
                  handleToggle('Promotional Offers', v);
                }}
              />
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Privacy & Security ────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Fingerprint className="h-3.5 w-3.5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-1">
              <SettingsToggle
                icon={Fingerprint}
                label="Biometric Login"
                description="Use fingerprint or face ID to login"
                checked={biometricLogin}
                onCheckedChange={(v) => {
                  setBiometricLogin(v);
                  handleToggle('Biometric Login', v);
                }}
              />
              <Separator className="mx-4 bg-border/40" />
              <SettingsToggle
                icon={Share2}
                label="Data Sharing"
                description="Share anonymized data for research"
                checked={dataSharing}
                onCheckedChange={(v) => {
                  setDataSharing(v);
                  handleToggle('Data Sharing', v);
                }}
              />
              <Separator className="mx-4 bg-border/40" />
              <SettingsAction
                icon={KeyRound}
                label="Change PIN"
                description="Update your security PIN"
                onClick={handleChangePIN}
              />
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Preferences ───────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              {/* Language */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Language
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred language
                    </p>
                  </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[130px] h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="kannada">Kannada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-border/40" />

              {/* Font Size */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Type className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Font Size
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Adjust text size
                    </p>
                  </div>
                </div>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="w-[110px] h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Data ──────────────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Download className="h-3.5 w-3.5" />
                Data
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <SettingsAction
                icon={Download}
                label="Export Health Data"
                description="Download your health records"
                onClick={handleExportData}
              />
              <SettingsAction
                icon={Trash2}
                label="Clear All Data"
                description="Remove all app data permanently"
                onClick={() => setClearDialogOpen(true)}
                destructive
              />
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── About ─────────────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Info className="h-3.5 w-3.5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              {/* App Version */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    App Version
                  </p>
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  Medpac v1.0.0
                </span>
              </div>

              <Separator className="bg-border/40" />

              {/* Rate Us */}
              <SettingsAction
                icon={Star}
                label="Rate Us"
                description="Help us improve with your feedback"
                onClick={handleRateUs}
              />

              {/* Share App */}
              <SettingsAction
                icon={Share}
                label="Share App"
                description="Share Medpac with family & friends"
                onClick={handleShareApp}
              />
            </CardContent>
          </Card>
        </motion.section>

        <div className="h-4" />
      </main>

      {/* ─── Clear Data Confirmation Dialog ──────────────────── */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Clear All Data?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-center text-sm text-muted-foreground">
              This will permanently remove all your health data, reminders,
              prescriptions, and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setClearDialogOpen(false)}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearData}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Clear Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
