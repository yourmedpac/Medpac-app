'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/lib/store';

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const steps: OnboardingStep[] = [
  {
    icon: <Heart className="w-20 h-20 text-white" fill="white" strokeWidth={0} />,
    title: "Your Family's Health Guardian",
    description:
      'Monitor and manage your entire family\'s health with AI-powered insights. From chronic conditions to daily wellness, Medpac keeps everyone protected.',
    gradient: 'from-teal-500 to-emerald-400',
  },
  {
    icon: <Brain className="w-20 h-20 text-white" />,
    title: 'AI That Understands You',
    description:
      'Our personalized AI health assistant learns your family\'s medical history, preferences, and needs to provide tailored recommendations you can trust.',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    icon: <Shield className="w-20 h-20 text-white" />,
    title: 'Complete Health Ecosystem',
    description:
      'Medicines, diagnostics, doctor consultations, health records, and smart reminders — all in one powerful platform designed for Indian families.',
    gradient: 'from-teal-600 to-emerald-500',
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const setScreen = useAppStore((s) => s.setScreen);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setScreen('quiz');
    }
  }, [currentStep, setScreen]);

  const handleSkip = useCallback(() => {
    setScreen('quiz');
  }, [setScreen]);

  const progressValue = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-teal-50/30">
      {/* Top progress bar */}
      <div className="pt-4 px-6">
        <Progress value={progressValue} className="h-1.5 bg-teal-100" />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              {/* Illustration area with gradient circle */}
              <div className="relative mb-10">
                {/* Outer glow */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${steps[currentStep].gradient} opacity-20 blur-2xl scale-125`}
                />
                {/* Decorative ring */}
                <div className="absolute -inset-4 rounded-full border-2 border-teal-200/40 animate-[spin_20s_linear_infinite]" />
                {/* Main icon circle */}
                <div
                  className={`relative w-44 h-44 rounded-full bg-gradient-to-br ${steps[currentStep].gradient} flex items-center justify-center shadow-2xl shadow-teal-500/25`}
                >
                  {/* Inner shimmer */}
                  <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-[1px]" />
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4, ease: 'backOut' }}
                  >
                    {steps[currentStep].icon}
                  </motion.div>
                </div>
              </div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-bold text-foreground text-center mb-4 leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                {steps[currentStep].title}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-muted-foreground text-center text-base leading-relaxed max-w-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
              >
                {steps[currentStep].description}
              </motion.p>

              {/* Feature highlights card */}
              <motion.div
                className="w-full mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
              >
                <Card className="border-teal-100 bg-white/70 backdrop-blur-sm shadow-lg shadow-teal-500/5">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-3">
                      {currentStep === 0 && (
                        <>
                          <FeatureLine text="Real-time health monitoring for all members" />
                          <FeatureLine text="AI alerts for potential health risks" />
                          <FeatureLine text="Family health dashboard at a glance" />
                        </>
                      )}
                      {currentStep === 1 && (
                        <>
                          <FeatureLine text="Converses in Hindi, English & regional languages" />
                          <FeatureLine text="Remembers your medical history & context" />
                          <FeatureLine text="Personalized diet & lifestyle suggestions" />
                        </>
                      )}
                      {currentStep === 2 && (
                        <>
                          <FeatureLine text="1,00,000+ medicines at best prices" />
                          <FeatureLine text="Book lab tests & doctor consults instantly" />
                          <FeatureLine text="Smart medicine reminders & health vault" />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2.5 pb-4">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className="focus:outline-none"
            aria-label={`Go to step ${idx + 1}`}
          >
            <motion.div
              className="rounded-full"
              animate={{
                width: idx === currentStep ? 28 : 10,
                height: 10,
                backgroundColor:
                  idx === currentStep
                    ? '#0d9488'
                    : idx < currentStep
                      ? '#14b8a6'
                      : '#d1d5db',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </button>
        ))}
      </div>

      {/* Bottom action buttons */}
      <div className="px-6 pb-8 pt-2">
        <div className="w-full max-w-md mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground flex-1 h-12 text-base"
          >
            Skip
          </Button>
          <Button
            onClick={handleNext}
            className="flex-[2] h-12 text-base font-semibold bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/30"
          >
            {isLastStep ? (
              'Get Started'
            ) : (
              <span className="flex items-center gap-2">
                Next
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* Small helper for feature lines */
function FeatureLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-teal-600" />
      </div>
      <span className="text-sm text-foreground/80 leading-snug">{text}</span>
    </div>
  );
}
