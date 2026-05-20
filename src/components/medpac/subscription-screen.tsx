'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Crown,
  Check,
  Star,
  Sparkles,
  Shield,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SubscriptionPlan } from '@/lib/types';
import { useAppStore, useQuizStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

// ─── Plans Data ───────────────────────────────────────────────
const PLANS: SubscriptionPlan[] = [
  {
    id: 'p1',
    name: 'Diabetes Care',
    condition: 'Diabetes',
    price: 499,
    features: [
      'Monthly doctor consultation',
      'Quarterly HbA1c test',
      'Medicine reminders & tracking',
      'Diet plan by nutritionist',
      '24/7 AI health support',
      'Free medicine delivery',
    ],
    duration: 'Monthly',
    popular: true,
  },
  {
    id: 'p2',
    name: 'Elderly Care',
    condition: 'Senior Health',
    price: 699,
    features: [
      'Bi-weekly doctor checkup',
      'Monthly health assessment',
      'Fall detection support',
      'Medicine management',
      'Emergency helpline',
      'Family health updates',
    ],
    duration: 'Monthly',
  },
  {
    id: 'p3',
    name: 'Thyroid Care',
    condition: 'Thyroid',
    price: 399,
    features: [
      'Monthly doctor consultation',
      'Quarterly thyroid profile',
      'Medication tracking',
      'Diet guidance',
      'AI symptom monitoring',
      'Free medicine delivery',
    ],
    duration: 'Monthly',
  },
  {
    id: 'p4',
    name: 'Heart Care',
    condition: 'Heart',
    price: 599,
    features: [
      'Monthly cardiologist consult',
      'Quarterly lipid profile',
      'BP monitoring reminders',
      'Heart-healthy diet plan',
      'Emergency support',
      'Free medicine delivery',
    ],
    duration: 'Monthly',
    popular: true,
  },
];

// ─── Plan condition icon mapping ─────────────────────────────
function getConditionIcon(condition: string) {
  switch (condition) {
    case 'Diabetes':
      return <Pill className="h-5 w-5" />;
    case 'Senior Health':
      return <Shield className="h-5 w-5" />;
    case 'Thyroid':
      return <Activity className="h-5 w-5" />;
    case 'Heart':
      return <Heart className="h-5 w-5" />;
    default:
      return <Stethoscope className="h-5 w-5" />;
  }
}

function getConditionGradient(condition: string) {
  switch (condition) {
    case 'Diabetes':
      return 'from-teal-500 to-cyan-500';
    case 'Senior Health':
      return 'from-amber-500 to-orange-500';
    case 'Thyroid':
      return 'from-purple-500 to-pink-500';
    case 'Heart':
      return 'from-red-500 to-rose-500';
    default:
      return 'from-emerald-500 to-teal-500';
  }
}

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

// ─── Subscription Screen Component ───────────────────────────
export default function SubscriptionScreen() {
  const { goBack } = useAppStore();
  const { quizCompleted, quizData } = useQuizStore();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Recommended plan based on quiz data
  const recommendation = useMemo(() => {
    if (!quizCompleted || !quizData) {
      return 'Choose a plan that fits your health needs';
    }
    const conditions = quizData.existingConditions.map((c) => c.toLowerCase());
    if (conditions.some((c) => c.includes('diabetes'))) {
      return 'Diabetes Care Plan recommended for you';
    }
    if (conditions.some((c) => c.includes('hypertension')) || conditions.some((c) => c.includes('heart'))) {
      return 'Heart Care Plan recommended for you';
    }
    if (conditions.some((c) => c.includes('thyroid'))) {
      return 'Thyroid Care Plan recommended for you';
    }
    return 'Choose a plan that fits your health needs';
  }, [quizCompleted, quizData]);

  const isRecommended = (condition: string): boolean => {
    if (!quizCompleted || !quizData) return false;
    const conditions = quizData.existingConditions.map((c) => c.toLowerCase());
    if (condition === 'Diabetes' && conditions.some((c) => c.includes('diabetes'))) return true;
    if (condition === 'Heart' && (conditions.some((c) => c.includes('hypertension')) || conditions.some((c) => c.includes('heart')))) return true;
    if (condition === 'Thyroid' && conditions.some((c) => c.includes('thyroid'))) return true;
    return false;
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (selectedPlan) {
      toast({
        title: 'Subscription Confirmed!',
        description: `Subscribed to ${selectedPlan.name}! Your care plan starts now.`,
      });
    }
    setConfirmOpen(false);
    setSelectedPlan(null);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-orange-50/10 dark:from-gray-950 dark:via-amber-950/5 dark:to-orange-950/5 pb-8"
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
              className="h-9 w-9 rounded-full hover:bg-amber-50 dark:hover:bg-amber-950"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Care Plans</h1>
                <p className="text-xs text-muted-foreground">
                  Personalized for your health needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ─── Main Content ───────────────────────────────────── */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* ─── Recommended Banner ────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-[1px]">
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/80 dark:to-orange-950/80 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground mb-1">
                    For You
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── Plan Cards ────────────────────────────────────── */}
        <motion.section variants={itemVariants} aria-label="Care Plans">
          <div className="space-y-4">
            {PLANS.map((plan) => {
              const recommended = isRecommended(plan.condition);
              return (
                <motion.div
                  key={plan.id}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`relative overflow-hidden border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 ${
                      recommended ? 'ring-2 ring-amber-400/60 dark:ring-amber-500/40' : ''
                    } ${plan.popular ? 'border-amber-200 dark:border-amber-800' : ''}`}
                  >
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute top-0 right-0">
                        <div className="flex items-center gap-1 rounded-bl-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1">
                          <Star className="h-3 w-3 text-white fill-white" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                            Popular
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Recommended indicator */}
                    {recommended && (
                      <div className="absolute top-0 left-0">
                        <div className="flex items-center gap-1 rounded-br-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1">
                          <Sparkles className="h-3 w-3 text-white" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                            Recommended
                          </span>
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-2 pt-5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getConditionGradient(
                            plan.condition
                          )} shadow-sm`}
                        >
                          <span className="text-white">{getConditionIcon(plan.condition)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <CardTitle className="text-base font-bold text-foreground">
                              {plan.name}
                            </CardTitle>
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-semibold px-2 py-0.5 bg-muted"
                            >
                              {plan.condition}
                            </Badge>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-foreground">
                              ₹{plan.price}
                            </span>
                            <span className="text-sm text-muted-foreground font-medium">
                              /{plan.duration.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 pb-4 px-4">
                      <Separator className="my-3 bg-border/40" />

                      {/* Features */}
                      <ul className="space-y-2 mb-4" role="list">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Subscribe button */}
                      <Button
                        onClick={() => handleSubscribe(plan)}
                        className={`w-full h-11 text-sm font-semibold transition-all duration-200 ${
                          recommended
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/25'
                            : plan.popular
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/25'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ─── Compare Plans ─────────────────────────────────── */}
        <motion.section variants={itemVariants} aria-label="Compare Plans">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-500" />
                Compare Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-2 pr-2 font-semibold text-foreground">
                        Feature
                      </th>
                      {PLANS.map((plan) => (
                        <th
                          key={plan.id}
                          className="text-center py-2 px-1 font-semibold text-foreground min-w-[70px]"
                        >
                          {plan.name.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Doctor Consult',
                      'Lab Tests',
                      'Medicine Reminders',
                      'Diet Plan',
                      'AI Support',
                      'Free Delivery',
                    ].map((feature) => (
                      <tr key={feature} className="border-b border-border/20">
                        <td className="py-2 pr-2 text-muted-foreground">
                          {feature}
                        </td>
                        {PLANS.map((plan) => (
                          <td key={plan.id} className="text-center py-2 px-1">
                            <Check className="h-3.5 w-3.5 mx-auto text-emerald-500 dark:text-emerald-400" />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="py-2 pr-2 font-semibold text-foreground">
                        Price
                      </td>
                      {PLANS.map((plan) => (
                        <td
                          key={plan.id}
                          className="text-center py-2 px-1 font-bold text-foreground"
                        >
                          ₹{plan.price}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <div className="h-4" />
      </main>

      {/* ─── Confirmation Dialog ─────────────────────────────── */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Confirm Subscription
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-center text-sm text-muted-foreground">
              Subscribe to{' '}
              <span className="font-bold text-foreground">
                {selectedPlan?.name}
              </span>{' '}
              for{' '}
              <span className="font-bold text-foreground">
                ₹{selectedPlan?.price}
              </span>
              /month?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
