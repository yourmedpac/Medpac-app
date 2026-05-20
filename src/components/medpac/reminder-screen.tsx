'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuid } from 'uuid';
import {
  ArrowLeft,
  Bell,
  Plus,
  Pill,
  Clock,
  Trash2,
  Pencil,
  CheckCircle2,
  CalendarDays,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore, useReminderStore, useFamilyStore } from '@/lib/store';
import type { Reminder } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

// ─── Frequency Options ───────────────────────────────────────
const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Every 8 hours',
  'Weekly',
  'As needed',
] as const;

type FrequencyOption = (typeof FREQUENCY_OPTIONS)[number];

// ─── Default time slots by frequency ─────────────────────────
function getDefaultTimes(frequency: FrequencyOption): string[] {
  switch (frequency) {
    case 'Once daily':
      return ['8:00 AM'];
    case 'Twice daily':
      return ['8:00 AM', '8:00 PM'];
    case 'Three times daily':
      return ['8:00 AM', '2:00 PM', '8:00 PM'];
    case 'Every 8 hours':
      return ['6:00 AM', '2:00 PM', '10:00 PM'];
    case 'Weekly':
      return ['9:00 AM'];
    case 'As needed':
      return [];
    default:
      return ['8:00 AM'];
  }
}

// ─── Filter Tab Type ─────────────────────────────────────────
type FilterTab = 'all' | 'active' | 'completed';

// ─── Animation Variants ──────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
} as const;

// ─── Today's Schedule Item ───────────────────────────────────
function ScheduleItem({
  time,
  medicineName,
  dosage,
  isPast,
  isCurrent,
}: {
  time: string;
  medicineName: string;
  dosage: string;
  isPast: boolean;
  isCurrent: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
            isCurrent
              ? 'bg-teal-500 ring-4 ring-teal-500/20'
              : isPast
              ? 'bg-gray-300 dark:bg-gray-600'
              : 'bg-muted-foreground/30'
          }`}
        />
        <div className="w-0.5 h-8 bg-border/40" />
      </div>
      {/* Content */}
      <div
        className={`flex-1 rounded-xl p-3 ${
          isCurrent
            ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800'
            : isPast
            ? 'bg-muted/30 opacity-60'
            : 'bg-muted/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">{medicineName}</p>
          <span
            className={`text-xs font-semibold ${
              isCurrent
                ? 'text-teal-600 dark:text-teal-400'
                : isPast
                ? 'text-muted-foreground'
                : 'text-muted-foreground'
            }`}
          >
            {time}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{dosage}</p>
        {isCurrent && (
          <Badge className="mt-1.5 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 border-0 text-[10px] font-semibold">
            Up Now
          </Badge>
        )}
        {isPast && (
          <Badge variant="secondary" className="mt-1.5 text-[10px]">
            Completed
          </Badge>
        )}
      </div>
    </div>
  );
}

// ─── Main Reminder Screen ────────────────────────────────────
export default function ReminderScreen() {
  const goBack = useAppStore((s) => s.goBack);
  const { reminders, addReminder, toggleReminder, deleteReminder, updateReminder } =
    useReminderStore();
  const { members } = useFamilyStore();

  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Form state
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<FrequencyOption>('Once daily');
  const [times, setTimes] = useState<string[]>(['8:00 AM']);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [memberId, setMemberId] = useState('self');
  const [notes, setNotes] = useState('');

  // Filtered reminders
  const filteredReminders = useMemo(() => {
    switch (filterTab) {
      case 'active':
        return reminders.filter((r) => r.isActive);
      case 'completed':
        return reminders.filter((r) => !r.isActive);
      default:
        return reminders;
    }
  }, [reminders, filterTab]);

  // Today's schedule: gather all times from active reminders
  const todaySchedule = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const items: {
      time: string;
      medicineName: string;
      dosage: string;
      sortKey: number;
      isPast: boolean;
      isCurrent: boolean;
    }[] = [];

    reminders
      .filter((r) => r.isActive)
      .forEach((r) => {
        r.times.forEach((time) => {
          const hourMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (hourMatch) {
            let hour = parseInt(hourMatch[1], 10);
            const minute = parseInt(hourMatch[2], 10);
            const ampm = hourMatch[3].toUpperCase();
            if (ampm === 'PM' && hour !== 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;

            const sortKey = hour * 60 + minute;
            const isPast =
              hour < currentHour || (hour === currentHour && minute < currentMinute);
            const isCurrent =
              !isPast &&
              (hour === currentHour ||
                (hour > currentHour && hour <= currentHour + 1));

            items.push({
              time,
              medicineName: r.medicineName,
              dosage: r.dosage,
              sortKey,
              isPast,
              isCurrent,
            });
          }
        });
      });

    return items.sort((a, b) => a.sortKey - b.sortKey);
  }, [reminders]);

  // Handle frequency change → update time inputs
  const handleFrequencyChange = (val: FrequencyOption) => {
    setFrequency(val);
    setTimes(getDefaultTimes(val));
  };

  // Reset form
  const resetForm = () => {
    setMedicineName('');
    setDosage('');
    setFrequency('Once daily');
    setTimes(['8:00 AM']);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setMemberId('self');
    setNotes('');
    setEditingReminder(null);
  };

  // Open edit dialog
  const openEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setMedicineName(reminder.medicineName);
    setDosage(reminder.dosage);
    setFrequency(reminder.frequency as FrequencyOption);
    setTimes([...reminder.times]);
    setStartDate(reminder.startDate);
    setEndDate(reminder.endDate || '');
    setMemberId(reminder.memberId || 'self');
    setNotes(reminder.notes || '');
    setDialogOpen(true);
  };

  // Save reminder
  const handleSave = () => {
    if (!medicineName.trim() || !dosage.trim()) return;

    if (editingReminder) {
      updateReminder(editingReminder.id, {
        medicineName: medicineName.trim(),
        dosage: dosage.trim(),
        frequency,
        times: times.filter((t) => t.trim()),
        startDate,
        endDate: endDate || undefined,
        memberId: memberId === 'self' ? undefined : memberId,
        notes: notes.trim() || undefined,
      });
      toast({ title: 'Reminder updated', description: `${medicineName} reminder has been updated.` });
    } else {
      const newReminder: Reminder = {
        id: uuid(),
        medicineName: medicineName.trim(),
        dosage: dosage.trim(),
        frequency,
        times: times.filter((t) => t.trim()),
        startDate,
        endDate: endDate || undefined,
        isActive: true,
        memberId: memberId === 'self' ? undefined : memberId,
        notes: notes.trim() || undefined,
      };
      addReminder(newReminder);
      toast({ title: 'Reminder added', description: `${medicineName} reminder has been set.` });
    }

    resetForm();
    setDialogOpen(false);
  };

  // Mark as taken
  const handleMarkTaken = (reminder: Reminder, time: string) => {
    toast({
      title: 'Marked as taken',
      description: `Marked as taken for ${time} — ${reminder.medicineName}`,
    });
  };

  // Update a time slot
  const updateTime = (index: number, value: string) => {
    const updated = [...times];
    updated[index] = value;
    setTimes(updated);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white via-teal-50/20 to-emerald-50/10 dark:from-gray-950 dark:via-teal-950/5 dark:to-emerald-950/5 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
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
                className="h-9 w-9 rounded-full hover:bg-teal-50 dark:hover:bg-teal-950"
                onClick={goBack}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-foreground">Medicine Reminders</h1>
              </div>
            </div>

            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold">
                    {editingReminder ? 'Edit Reminder' : 'Add Medicine Reminder'}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                  {/* Medicine Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Medicine Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., Metformin"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* Dosage */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Dosage <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., 1 tablet, 10ml"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* Frequency */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Frequency</Label>
                    <Select
                      value={frequency}
                      onValueChange={(val) =>
                        handleFrequencyChange(val as FrequencyOption)
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Inputs */}
                  {times.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Times</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {times.map((time, idx) => (
                          <Input
                            key={idx}
                            placeholder="8:00 AM"
                            value={time}
                            onChange={(e) => updateTime(idx, e.target.value)}
                            className="h-9 text-sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">End Date (optional)</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* Member */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">For Member</Label>
                    <Select value={memberId} onValueChange={setMemberId}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        {members.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name} ({m.relation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Notes</Label>
                    <Textarea
                      placeholder="Any special instructions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="text-sm min-h-[60px] resize-none"
                    />
                  </div>

                  <Separator />

                  {/* Save */}
                  <Button
                    className="w-full h-10 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={handleSave}
                    disabled={!medicineName.trim() || !dosage.trim()}
                  >
                    {editingReminder ? 'Update Reminder' : 'Save Reminder'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.header>

      {/* ─── Main Content ───────────────────────────────────────── */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-5">
        {/* ─── Today's Schedule ──────────────────────────────────── */}
        <motion.section variants={itemVariants} aria-label="Today's Schedule">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-foreground">Today&apos;s Schedule</h2>
          </div>

          {todaySchedule.length === 0 ? (
            <Card className="border-dashed border-border/60 bg-muted/20">
              <CardContent className="py-5 text-center">
                <Clock className="h-7 w-7 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-xs text-muted-foreground">
                  No medicines scheduled for today
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-0">
              {todaySchedule.map((item, idx) => (
                <ScheduleItem
                  key={`${item.medicineName}-${item.time}-${idx}`}
                  time={item.time}
                  medicineName={item.medicineName}
                  dosage={item.dosage}
                  isPast={item.isPast}
                  isCurrent={item.isCurrent}
                />
              ))}
            </div>
          )}
        </motion.section>

        <Separator />

        {/* ─── Active Reminders Section ──────────────────────────── */}
        <motion.section variants={itemVariants} aria-label="Active Reminders">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-3">
            {(['all', 'active', 'completed'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 capitalize ${
                  filterTab === tab
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/25'
                    : 'bg-white dark:bg-gray-900 text-muted-foreground border border-border/60 hover:border-teal-300 hover:text-teal-700 dark:hover:border-teal-800 dark:hover:text-teal-400'
                }`}
              >
                {tab}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground font-medium">
              {filteredReminders.length} reminder{filteredReminders.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Reminders List */}
          <AnimatePresence mode="popLayout">
            {filteredReminders.length > 0 ? (
              <div className="space-y-3">
                {filteredReminders.map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-3">
                        {/* Top: Name + Dosage + Frequency Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
                              <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-foreground truncate">
                                {reminder.medicineName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {reminder.dosage}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 ${
                              reminder.isActive
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {reminder.frequency}
                          </Badge>
                        </div>

                        {/* Time Chips */}
                        {reminder.times.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {reminder.times.map((time, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[11px] font-medium text-teal-700 dark:text-teal-300"
                              >
                                <Clock className="h-3 w-3" />
                                {time}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Date Range */}
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          <span>
                            {reminder.startDate}
                            {reminder.endDate ? ` — ${reminder.endDate}` : ' — Ongoing'}
                          </span>
                        </div>

                        {/* Member */}
                        {reminder.memberId && (
                          <p className="text-[11px] text-muted-foreground">
                            For:{' '}
                            {members.find((m) => m.id === reminder.memberId)?.name ||
                              'Family Member'}
                          </p>
                        )}

                        <Separator />

                        {/* Actions Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* Active Toggle */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-muted-foreground font-medium">
                                Active
                              </span>
                              <Switch
                                checked={reminder.isActive}
                                onCheckedChange={() => toggleReminder(reminder.id)}
                                className="data-[state=checked]:bg-teal-600"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Mark as Taken */}
                            {reminder.isActive && reminder.times.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950"
                                onClick={() =>
                                  handleMarkTaken(reminder, reminder.times[0])
                                }
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-0.5" />
                                Mark as Taken
                              </Button>
                            )}
                            {/* Edit */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:bg-muted"
                              onClick={() => openEdit(reminder)}
                              aria-label="Edit reminder"
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => {
                                deleteReminder(reminder.id);
                                toast({
                                  title: 'Reminder deleted',
                                  description: `${reminder.medicineName} reminder removed.`,
                                });
                              }}
                              aria-label="Delete reminder"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-teal-400 dark:text-teal-500" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  No reminders set
                </h3>
                <p className="text-sm text-muted-foreground max-w-[220px] mb-4">
                  Keep track of your medicines with timely reminders
                </p>
                <Button
                  size="sm"
                  className="h-8 px-4 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add your first medicine reminder
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
    </motion.div>
  );
}
