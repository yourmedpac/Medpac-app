'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Phone,
  Heart,
  Target,
  Activity,
  Users,
  Shield,
  FileText,
  Pill,
  Crown,
  Bell,
  Settings,
  HelpCircle,
  Lock,
  FileCheck,
  ChevronRight,
  LogOut,
  Pencil,
  Droplet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Screen } from '@/lib/types';
import { useAppStore, useAuthStore, useQuizStore } from '@/lib/store';
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

// ─── Quick Link Item ─────────────────────────────────────────
function QuickLink({
  icon: Icon,
  label,
  screen,
  iconBg,
}: {
  icon: React.ElementType;
  label: string;
  screen: Screen;
  iconBg: string;
}) {
  const setScreen = useAppStore((s) => s.setScreen);

  return (
    <motion.button
      variants={itemVariants}
      whileTap={{ scale: 0.97 }}
      onClick={() => setScreen(screen)}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`Navigate to ${label}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
      <span className="flex-1 text-sm font-medium text-foreground">
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </motion.button>
  );
}

// ─── Profile Screen Component ────────────────────────────────
export default function ProfileScreen() {
  const { goBack, setScreen } = useAppStore();
  const { user, updateUser, logout } = useAuthStore();
  const { quizCompleted, quizData } = useQuizStore();

  // Edit profile dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editAge, setEditAge] = useState(user?.age?.toString() || '');
  const [editGender, setEditGender] = useState(user?.gender || '');
  const [editBloodGroup, setEditBloodGroup] = useState(user?.bloodGroup || '');
  const [editAllergies, setEditAllergies] = useState(
    user?.allergies?.join(', ') || ''
  );
  const [editEmergencyContact, setEditEmergencyContact] = useState(
    user?.emergencyContact || ''
  );

  // Sync edit fields and open dialog
  const openEditDialog = useCallback(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditAge(user.age?.toString() || '');
      setEditGender(user.gender || '');
      setEditBloodGroup(user.bloodGroup || '');
      setEditAllergies(user.allergies?.join(', ') || '');
      setEditEmergencyContact(user.emergencyContact || '');
    }
    setEditOpen(true);
  }, [user]);

  const handleSaveProfile = () => {
    updateUser({
      name: editName.trim() || user?.name,
      email: editEmail.trim() || undefined,
      age: editAge ? parseInt(editAge, 10) : undefined,
      gender: editGender
        ? (editGender as 'male' | 'female' | 'other')
        : undefined,
      bloodGroup: editBloodGroup || undefined,
      allergies: editAllergies.trim()
        ? editAllergies
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean)
        : undefined,
      emergencyContact: editEmergencyContact.trim() || undefined,
    });
    setEditOpen(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully.',
    });
  };

  const handleSignOut = () => {
    logout();
    setScreen('login');
  };

  const userName = user?.name || 'User';
  const userPhone = user?.phone || '+91 XXXXXXXXXX';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white via-emerald-50/20 to-teal-50/10 dark:from-gray-950 dark:via-emerald-950/5 dark:to-teal-950/5 pb-8"
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
              className="h-9 w-9 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-foreground">My Profile</h1>
          </div>
        </div>
      </motion.header>

      {/* ─── Main Content ───────────────────────────────────── */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* ─── Profile Card ──────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardContent className="pt-6 pb-5 px-4">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-3">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    {user?.avatar ? (
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="bg-transparent text-white text-2xl font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="h-10 w-10 text-white" />
                    )}
                  </div>
                </div>

                {/* Name & Phone */}
                <h2 className="text-xl font-bold text-foreground">{userName}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Phone className="h-3 w-3" />
                  {userPhone}
                </p>

                {/* Edit Profile button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEditDialog}
                  className="mt-3 gap-1.5 text-sm font-medium border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Health Summary Card ───────────────────────────── */}
        <motion.section variants={itemVariants}>
          {quizCompleted && quizData ? (
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Heart className="h-4 w-4 text-emerald-500" />
                  Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {/* Conditions */}
                {quizData.existingConditions.length > 0 &&
                  !quizData.existingConditions.includes('None') && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Conditions
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {quizData.existingConditions.map((condition) => (
                          <Badge
                            key={condition}
                            variant="secondary"
                            className="text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200/50 dark:border-red-800/50"
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Health Goals */}
                {quizData.healthGoals.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Health Goals
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {quizData.healthGoals.map((goal) => (
                        <Badge
                          key={goal}
                          variant="secondary"
                          className="text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50"
                        >
                          <Target className="h-3 w-3 mr-1" />
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity Level */}
                {quizData.activityLevel && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Activity Level
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200/50 dark:border-cyan-800/50"
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      {quizData.activityLevel.charAt(0).toUpperCase() +
                        quizData.activityLevel.slice(1)}
                    </Badge>
                  </div>
                )}

                <Separator className="bg-border/40" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScreen('quiz')}
                  className="w-full text-sm font-medium border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950"
                >
                  Retake Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-border/60 bg-muted/30 dark:bg-muted/10">
              <CardContent className="py-6 text-center space-y-3">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
                  <Heart className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Complete your health profile
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Take a quick quiz for personalized health insights
                  </p>
                </div>
                <Button
                  onClick={() => setScreen('quiz')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                >
                  Take Health Quiz
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.section>

        {/* ─── Quick Links ───────────────────────────────────── */}
        <motion.section variants={itemVariants} aria-label="Quick Links">
          <Card className="border-border/40 shadow-sm">
            <CardContent className="py-2 px-2">
              <QuickLink
                icon={Users}
                label="My Family"
                screen="family"
                iconBg="bg-gradient-to-br from-purple-500 to-pink-500"
              />
              <QuickLink
                icon={Shield}
                label="Health Vault"
                screen="health-vault"
                iconBg="bg-gradient-to-br from-amber-500 to-orange-500"
              />
              <QuickLink
                icon={FileText}
                label="Prescriptions"
                screen="prescription"
                iconBg="bg-gradient-to-br from-cyan-500 to-blue-500"
              />
              <QuickLink
                icon={Pill}
                label="Medicine Reminders"
                screen="reminders"
                iconBg="bg-gradient-to-br from-emerald-500 to-teal-500"
              />
              <QuickLink
                icon={Crown}
                label="Care Plans"
                screen="subscriptions"
                iconBg="bg-gradient-to-br from-amber-500 to-yellow-500"
              />
              <QuickLink
                icon={Bell}
                label="Notifications"
                screen="notifications"
                iconBg="bg-gradient-to-br from-red-500 to-rose-500"
              />
              <QuickLink
                icon={Settings}
                label="Settings"
                screen="settings"
                iconBg="bg-gradient-to-br from-gray-500 to-slate-500"
              />
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Account Section ───────────────────────────────── */}
        <motion.section variants={itemVariants} aria-label="Account">
          <Card className="border-border/40 shadow-sm">
            <CardContent className="py-2 px-2">
              <motion.button
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  toast({
                    title: 'Coming Soon',
                    description: 'Support chat coming soon',
                  })
                }
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500">
                  <HelpCircle className="h-4 w-4 text-white" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  Help & Support
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </motion.button>

              <motion.button
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  toast({
                    title: 'Coming Soon',
                    description: 'Privacy policy page coming soon',
                  })
                }
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-gray-500">
                  <Lock className="h-4 w-4 text-white" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  Privacy Policy
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </motion.button>

              <motion.button
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  toast({
                    title: 'Coming Soon',
                    description: 'Terms page coming soon',
                  })
                }
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                  <FileCheck className="h-4 w-4 text-white" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  Terms of Service
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </motion.button>

              <Separator className="my-1 bg-border/40" />

              <motion.button
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
                  <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="flex-1 text-sm font-semibold text-red-600 dark:text-red-400">
                  Sign Out
                </span>
              </motion.button>
            </CardContent>
          </Card>
        </motion.section>

        <div className="h-4" />
      </main>

      {/* ─── Edit Profile Dialog ─────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-sm font-semibold">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
                className="h-11"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-email" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-11"
              />
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-age" className="text-sm font-semibold">
                Age
              </Label>
              <Input
                id="edit-age"
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                placeholder="Age"
                min={1}
                max={120}
                className="h-11"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Gender</Label>
              <Select
                value={editGender}
                onValueChange={setEditGender}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Blood Group</Label>
              <Select value={editBloodGroup} onValueChange={setEditBloodGroup}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                    (bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Allergies */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-allergies" className="text-sm font-semibold">
                Allergies
              </Label>
              <Input
                id="edit-allergies"
                value={editAllergies}
                onChange={(e) => setEditAllergies(e.target.value)}
                placeholder="Comma separated (e.g., Peanuts, Penicillin)"
                className="h-11"
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-emergency"
                className="text-sm font-semibold"
              >
                Emergency Contact
              </Label>
              <Input
                id="edit-emergency"
                type="tel"
                value={editEmergencyContact}
                onChange={(e) => setEditEmergencyContact(e.target.value)}
                placeholder="+91 XXXXXXXXXX"
                className="h-11"
              />
            </div>

            {/* Save button */}
            <Button
              onClick={handleSaveProfile}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
