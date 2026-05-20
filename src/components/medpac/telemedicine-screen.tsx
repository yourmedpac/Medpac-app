'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Stethoscope,
  Star,
  Clock,
  Globe,
  Video,
  CalendarDays,
  CheckCircle2,
  CircleDot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import type { Doctor } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

// ─── Doctors Data ────────────────────────────────────────────
const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Rajesh Sharma',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD',
    experience: 15,
    rating: 4.8,
    consultationFee: 299,
    availableSlots: ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
    languages: ['Hindi', 'English'],
    online: true,
  },
  {
    id: 'd2',
    name: 'Dr. Priya Mehta',
    specialization: 'Gynecology',
    qualification: 'MBBS, MS (OBG)',
    experience: 12,
    rating: 4.9,
    consultationFee: 499,
    availableSlots: ['9:00 AM', '10:30 AM', '3:00 PM'],
    languages: ['Hindi', 'English', 'Gujarati'],
    online: true,
  },
  {
    id: 'd3',
    name: 'Dr. Anil Kumar',
    specialization: 'Cardiology',
    qualification: 'MBBS, DM (Cardiology)',
    experience: 20,
    rating: 4.7,
    consultationFee: 699,
    availableSlots: ['11:00 AM', '3:00 PM', '5:00 PM'],
    languages: ['Hindi', 'English'],
    online: false,
  },
  {
    id: 'd4',
    name: 'Dr. Sneha Reddy',
    specialization: 'Dermatology',
    qualification: 'MBBS, MD (Derm)',
    experience: 8,
    rating: 4.6,
    consultationFee: 399,
    availableSlots: ['10:00 AM', '12:00 PM', '4:00 PM'],
    languages: ['English', 'Telugu', 'Hindi'],
    online: true,
  },
  {
    id: 'd5',
    name: 'Dr. Vikram Singh',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho)',
    experience: 18,
    rating: 4.8,
    consultationFee: 599,
    availableSlots: ['9:30 AM', '2:30 PM'],
    languages: ['Hindi', 'English', 'Punjabi'],
    online: false,
  },
  {
    id: 'd6',
    name: 'Dr. Kavitha Nair',
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 10,
    rating: 4.9,
    consultationFee: 349,
    availableSlots: ['10:00 AM', '11:30 AM', '3:30 PM', '5:00 PM'],
    languages: ['English', 'Malayalam', 'Hindi'],
    online: true,
  },
  {
    id: 'd7',
    name: 'Dr. Amit Patel',
    specialization: 'Psychiatry',
    qualification: 'MBBS, MD (Psych)',
    experience: 14,
    rating: 4.5,
    consultationFee: 599,
    availableSlots: ['11:00 AM', '2:00 PM', '4:30 PM'],
    languages: ['Hindi', 'English', 'Gujarati'],
    online: true,
  },
  {
    id: 'd8',
    name: 'Dr. Meera Joshi',
    specialization: 'ENT',
    qualification: 'MBBS, MS (ENT)',
    experience: 11,
    rating: 4.7,
    consultationFee: 399,
    availableSlots: ['9:00 AM', '11:00 AM', '3:00 PM'],
    languages: ['Hindi', 'English', 'Marathi'],
    online: false,
  },
];

// ─── Specialties ─────────────────────────────────────────────
const SPECIALTIES = [
  'All',
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Gynecology',
  'Pediatrics',
  'Orthopedics',
  'Psychiatry',
  'ENT',
  'Ophthalmology',
];

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

// ─── Rating Stars ────────────────────────────────────────────
function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f-${i}`} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && (
        <div className="relative h-3 w-3">
          <Star className="h-3 w-3 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`e-${i}`} className="h-3 w-3 text-gray-300" />
      ))}
      <span className="ml-1 text-xs text-muted-foreground font-medium">{rating}</span>
    </div>
  );
}

// ─── Get initials from name ──────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((w) => !w.startsWith('Dr') && !w.startsWith('Dr.'))
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Main Telemedicine Screen ────────────────────────────────
export default function TelemedicineScreen() {
  const goBack = useAppStore((s) => s.goBack);

  const [activeSpecialty, setActiveSpecialty] = useState('All');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState('');

  // Filter doctors by specialty
  const filteredDoctors = useMemo(() => {
    if (activeSpecialty === 'All') return DOCTORS;
    return DOCTORS.filter((d) => d.specialization === activeSpecialty);
  }, [activeSpecialty]);

  // Open booking dialog
  const openBooking = (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setSelectedDate('today');
    setSelectedSlot(null);
    setCustomDate('');
  };

  // Confirm booking
  const confirmBooking = () => {
    if (!bookingDoctor || !selectedSlot) return;
    toast({
      title: 'Appointment confirmed!',
      description: `You'll receive a reminder 30 minutes before your consultation with ${bookingDoctor.name}.`,
    });
    setBookingDoctor(null);
    setSelectedSlot(null);
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
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-foreground">Consult a Doctor</h1>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ─── Specialty Filter ───────────────────────────────────── */}
      <div className="sticky top-[57px] z-9 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 py-2.5">
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none -mx-4 px-4">
            {SPECIALTIES.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => setActiveSpecialty(spec)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeSpecialty === spec
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/25'
                    : 'bg-white dark:bg-gray-900 text-muted-foreground border border-border/60 hover:border-teal-300 hover:text-teal-700 dark:hover:border-teal-800 dark:hover:text-teal-400'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content ───────────────────────────────────────── */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium">
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} available
        </p>

        <AnimatePresence mode="popLayout">
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              variants={itemVariants}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  {/* Top Row: Avatar + Info + Fee */}
                  <div className="flex items-start gap-3">
                    {/* Avatar with initials */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 shadow-sm">
                      <span className="text-sm font-bold text-white">
                        {getInitials(doctor.name)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">
                            {doctor.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {doctor.qualification}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold text-teal-700 dark:text-teal-400">
                            ₹{doctor.consultationFee}
                          </p>
                          <p className="text-[10px] text-muted-foreground">consultation</p>
                        </div>
                      </div>

                      {/* Badges row */}
                      <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold px-1.5 py-0.5 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border-0"
                        >
                          {doctor.specialization}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold px-1.5 py-0.5 border-0"
                        >
                          <Clock className="h-3 w-3 mr-0.5" />
                          {doctor.experience} yrs exp
                        </Badge>
                        <Badge
                          className={`text-[10px] font-semibold px-1.5 py-0.5 border-0 ${
                            doctor.online
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          <CircleDot className="h-3 w-3 mr-0.5" />
                          {doctor.online ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <RatingStars rating={doctor.rating} />

                  {/* Languages */}
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>

                  {/* Available Slots */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-muted-foreground font-semibold">
                      Available Slots
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {doctor.availableSlots.map((slot) => (
                        <span
                          key={slot}
                          className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Book Button */}
                  <Button
                    className="w-full h-9 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => openBooking(doctor)}
                  >
                    <Video className="h-3.5 w-3.5 mr-1.5" />
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* ─── Booking Dialog ──────────────────────────────────────── */}
      <Dialog
        open={!!bookingDoctor}
        onOpenChange={(open) => {
          if (!open) setBookingDoctor(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Book Consultation</DialogTitle>
          </DialogHeader>

          {bookingDoctor && (
            <div className="space-y-4 pt-2">
              {/* Doctor Info Summary */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600">
                  <span className="text-xs font-bold text-white">
                    {getInitials(bookingDoctor.name)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {bookingDoctor.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {bookingDoctor.specialization} &bull; {bookingDoctor.qualification}
                  </p>
                  <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mt-0.5">
                    ₹{bookingDoctor.consultationFee}
                  </p>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">Select Date</p>
                <div className="flex gap-2">
                  {(
                    [
                      { key: 'today', label: 'Today' },
                      { key: 'tomorrow', label: 'Tomorrow' },
                      { key: 'custom', label: 'Custom' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSelectedDate(opt.key)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                        selectedDate === opt.key
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white dark:bg-gray-900 text-muted-foreground border-border/60 hover:border-teal-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {selectedDate === 'custom' && (
                  <Input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="h-9 text-sm mt-1"
                  />
                )}
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">Select Time Slot</p>
                <div className="grid grid-cols-3 gap-2">
                  {bookingDoctor.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                        selectedSlot === slot
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white dark:bg-gray-900 text-muted-foreground border-border/60 hover:border-teal-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Confirm */}
              <Button
                className="w-full h-10 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                onClick={confirmBooking}
                disabled={!selectedSlot}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Confirm Booking
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
