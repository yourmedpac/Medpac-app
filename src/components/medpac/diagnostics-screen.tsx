'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  TestTube,
  Search,
  Clock,
  Tag,
  Home,
  Plus,
  X,
  ShoppingCart,
  CheckCircle2,
  CalendarDays,
  FlaskConical,
  Info,
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
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

// ─── Test Data ───────────────────────────────────────────────
interface TestItem {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  category: string;
  turnaround: string;
  preparation: string;
}

const TESTS: TestItem[] = [
  {
    id: 't1',
    name: 'Complete Blood Count (CBC)',
    price: 350,
    discountPrice: 299,
    category: 'Blood',
    turnaround: '6 hours',
    preparation: 'No special preparation needed',
  },
  {
    id: 't2',
    name: 'Thyroid Profile (T3, T4, TSH)',
    price: 600,
    discountPrice: 499,
    category: 'Thyroid',
    turnaround: '12 hours',
    preparation: 'Fasting not required',
  },
  {
    id: 't3',
    name: 'HbA1c (Glycated Hemoglobin)',
    price: 450,
    discountPrice: 379,
    category: 'Diabetes',
    turnaround: '8 hours',
    preparation: 'No fasting required',
  },
  {
    id: 't4',
    name: 'Lipid Profile',
    price: 500,
    discountPrice: 399,
    category: 'Heart',
    turnaround: '12 hours',
    preparation: '10-12 hours fasting required',
  },
  {
    id: 't5',
    name: 'Liver Function Test (LFT)',
    price: 550,
    discountPrice: 449,
    category: 'Liver',
    turnaround: '12 hours',
    preparation: '10-12 hours fasting required',
  },
  {
    id: 't6',
    name: 'Kidney Function Test (KFT)',
    price: 500,
    discountPrice: 399,
    category: 'Kidney',
    turnaround: '12 hours',
    preparation: 'Fasting preferred',
  },
  {
    id: 't7',
    name: 'Vitamin D',
    price: 800,
    discountPrice: 649,
    category: 'Vitamins',
    turnaround: '24 hours',
    preparation: 'No special preparation',
  },
  {
    id: 't8',
    name: 'Vitamin B12',
    price: 700,
    discountPrice: 549,
    category: 'Vitamins',
    turnaround: '24 hours',
    preparation: 'Fasting preferred',
  },
  {
    id: 't9',
    name: 'Full Body Checkup',
    price: 2500,
    discountPrice: 1799,
    category: 'Package',
    turnaround: '24 hours',
    preparation: '10-12 hours fasting required',
  },
  {
    id: 't10',
    name: 'Diabetes Screening Package',
    price: 1200,
    discountPrice: 899,
    category: 'Package',
    turnaround: '12 hours',
    preparation: 'Fasting required',
  },
];

const CATEGORIES = ['All', 'Blood', 'Thyroid', 'Diabetes', 'Heart', 'Vitamins', 'Package'];

const HOME_COLLECTION_FEE = 100;

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

// ─── Main Diagnostics Screen ─────────────────────────────────
export default function DiagnosticsScreen() {
  const goBack = useAppStore((s) => s.goBack);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Cart state: array of test ids
  const [cart, setCart] = useState<string[]>([]);

  // Booking dialog state
  const [bookingTest, setBookingTest] = useState<TestItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customDate, setCustomDate] = useState('');
  const [homeCollection, setHomeCollection] = useState(false);
  const [address, setAddress] = useState('');

  // Multi-book dialog state
  const [multiBookOpen, setMultiBookOpen] = useState(false);
  const [multiDate, setMultiDate] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [multiCustomDate, setMultiCustomDate] = useState('');
  const [multiHomeCollection, setMultiHomeCollection] = useState(false);
  const [multiAddress, setMultiAddress] = useState('');

  // Filter tests
  const filteredTests = useMemo(() => {
    return TESTS.filter((t) => {
      const matchesCategory =
        activeCategory === 'All' || t.category === activeCategory;
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query || t.name.toLowerCase().includes(query) || t.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  // Cart helpers
  const addToCart = (testId: string) => {
    setCart((prev) => (prev.includes(testId) ? prev : [...prev, testId]));
  };

  const removeFromCart = (testId: string) => {
    setCart((prev) => prev.filter((id) => id !== testId));
  };

  const cartTests = useMemo(() => TESTS.filter((t) => cart.includes(t.id)), [cart]);

  const cartTotal = useMemo(() => {
    const testsTotal = cartTests.reduce((sum, t) => sum + t.discountPrice, 0);
    return testsTotal;
  }, [cartTests]);

  const isSingleBooking = !bookingTest ? false : !cart.includes(bookingTest.id);

  // Single test booking
  const openSingleBooking = (test: TestItem) => {
    setBookingTest(test);
    setSelectedDate('today');
    setCustomDate('');
    setHomeCollection(false);
    setAddress('');
  };

  const confirmSingleBooking = () => {
    if (!bookingTest) return;
    const dateLabel =
      selectedDate === 'today'
        ? 'today'
        : selectedDate === 'tomorrow'
        ? 'tomorrow'
        : customDate;
    toast({
      title: 'Test booked!',
      description: `Sample collection for ${bookingTest.name} scheduled for ${dateLabel}.`,
    });
    setBookingTest(null);
  };

  // Multi-book from cart
  const openMultiBook = () => {
    setMultiBookOpen(true);
    setMultiDate('today');
    setMultiCustomDate('');
    setMultiHomeCollection(false);
    setMultiAddress('');
  };

  const confirmMultiBooking = () => {
    const dateLabel =
      multiDate === 'today'
        ? 'today'
        : multiDate === 'tomorrow'
        ? 'tomorrow'
        : multiCustomDate;
    toast({
      title: 'Tests booked!',
      description: `Sample collection for ${cartTests.length} test(s) scheduled for ${dateLabel}.`,
    });
    setCart([]);
    setMultiBookOpen(false);
  };

  // Discount percent
  const discountPct = (test: TestItem) =>
    Math.round(((test.price - test.discountPrice) / test.price) * 100);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white via-teal-50/20 to-emerald-50/10 dark:from-gray-950 dark:via-teal-950/5 dark:to-emerald-950/5 pb-24"
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
                  <TestTube className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-foreground">Book Lab Tests</h1>
              </div>
            </div>

            {/* Cart indicator */}
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="relative h-8 px-2 hover:bg-teal-50 dark:hover:bg-teal-950"
                onClick={openMultiBook}
              >
                <ShoppingCart className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="ml-1 text-xs font-bold text-teal-600 dark:text-teal-400">
                  {cart.length}
                </span>
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* ─── Search & Category Filter ────────────────────────────── */}
      <div className="sticky top-[57px] z-9 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 py-2.5 space-y-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tests, packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm bg-white dark:bg-gray-900 border-border/60"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none -mx-4 px-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/25'
                    : 'bg-white dark:bg-gray-900 text-muted-foreground border border-border/60 hover:border-teal-300 hover:text-teal-700 dark:hover:border-teal-800 dark:hover:text-teal-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content ───────────────────────────────────────── */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium">
          {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} available
        </p>

        <AnimatePresence mode="popLayout">
          {filteredTests.map((test) => {
            const inCart = cart.includes(test.id);
            return (
              <motion.div
                key={test.id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    {/* Top: Name + Category Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-950">
                          <FlaskConical className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground leading-tight">
                            {test.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-0"
                      >
                        {test.category}
                      </Badge>
                    </div>

                    {/* Turnaround + Preparation */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Results in {test.turnaround}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <Info className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{test.preparation}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Price + Actions */}
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-foreground">
                            ₹{test.discountPrice}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{test.price}
                          </span>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-0 text-[10px] font-bold px-1.5 py-0.5 mt-0.5">
                          {discountPct(test)}% OFF
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        {inCart ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2.5 text-[11px] font-semibold border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                            onClick={() => removeFromCart(test.id)}
                          >
                            <X className="h-3 w-3 mr-0.5" />
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2.5 text-[11px] font-semibold border-teal-200 text-teal-600 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-950"
                            onClick={() => addToCart(test.id)}
                          >
                            <Plus className="h-3 w-3 mr-0.5" />
                            Add
                          </Button>
                        )}
                        <Button
                          size="sm"
                          className="h-7 px-3 text-[11px] font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                          onClick={() => openSingleBooking(test)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>

      {/* ─── Cart Summary (sticky bottom) ────────────────────────── */}
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-border/40 shadow-lg"
        >
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  {cart.length} test{cart.length !== 1 ? 's' : ''} selected
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-foreground">₹{cartTotal}</span>
                  {cart.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      + {HOME_COLLECTION_FEE} for home collection
                    </span>
                  )}
                </div>
              </div>
              <Button
                className="h-10 px-5 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                onClick={openMultiBook}
              >
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Book All Tests
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Single Booking Dialog ───────────────────────────────── */}
      <Dialog
        open={!!bookingTest}
        onOpenChange={(open) => {
          if (!open) setBookingTest(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Book Lab Test</DialogTitle>
          </DialogHeader>

          {bookingTest && (
            <div className="space-y-4 pt-2">
              {/* Test Info */}
              <div className="p-3 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30 space-y-1.5">
                <p className="text-sm font-bold text-foreground">{bookingTest.name}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-semibold px-1.5 py-0.5 border-0 bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300"
                  >
                    {bookingTest.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Results in {bookingTest.turnaround}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-foreground">
                    ₹{bookingTest.discountPrice}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{bookingTest.price}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  <Info className="h-3 w-3 inline mr-1" />
                  {bookingTest.preparation}
                </p>
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

              {/* Home Collection Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/40">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Home Sample Collection
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        +₹{HOME_COLLECTION_FEE} additional
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={homeCollection}
                    onCheckedChange={setHomeCollection}
                    className="data-[state=checked]:bg-teal-600"
                  />
                </div>
                {homeCollection && (
                  <Textarea
                    placeholder="Enter your full address for sample collection..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-sm min-h-[60px] resize-none"
                  />
                )}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">
                  ₹{bookingTest.discountPrice + (homeCollection ? HOME_COLLECTION_FEE : 0)}
                </span>
              </div>

              {/* Confirm */}
              <Button
                className="w-full h-10 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                onClick={confirmSingleBooking}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Confirm Booking
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Multi-Book Dialog ───────────────────────────────────── */}
      <Dialog open={multiBookOpen} onOpenChange={setMultiBookOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Book All Tests</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Selected Tests List */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground">Selected Tests</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {cartTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {test.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{test.category}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-foreground">
                        ₹{test.discountPrice}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => removeFromCart(test.id)}
                        aria-label={`Remove ${test.name}`}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

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
                    onClick={() => setMultiDate(opt.key)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                      multiDate === opt.key
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white dark:bg-gray-900 text-muted-foreground border-border/60 hover:border-teal-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {multiDate === 'custom' && (
                <Input
                  type="date"
                  value={multiCustomDate}
                  onChange={(e) => setMultiCustomDate(e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              )}
            </div>

            {/* Home Collection Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/40">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Home Sample Collection
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      +₹{HOME_COLLECTION_FEE} additional
                    </p>
                  </div>
                </div>
                <Switch
                  checked={multiHomeCollection}
                  onCheckedChange={setMultiHomeCollection}
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>
              {multiHomeCollection && (
                <Textarea
                  placeholder="Enter your full address for sample collection..."
                  value={multiAddress}
                  onChange={(e) => setMultiAddress(e.target.value)}
                  className="text-sm min-h-[60px] resize-none"
                />
              )}
            </div>

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">
                ₹{cartTotal + (multiHomeCollection ? HOME_COLLECTION_FEE : 0)}
              </span>
            </div>

            {/* Confirm */}
            <Button
              className="w-full h-10 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white"
              onClick={confirmMultiBooking}
              disabled={cartTests.length === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Book All Tests
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
