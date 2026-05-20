'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Plus,
  Moon,
  Activity,
  Cigarette,
  Scale,
  Utensils,
  Droplet,
  Brain,
  Flame,
  ShieldAlert,
  Sparkles,
  Clock,
  Compass,
  ArrowRight,
  Shield,
  Coffee,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { QuizResponse } from '@/lib/types';
import { useQuizStore, useAppStore } from '@/lib/store';

// ─── Constants ────────────────────────────────────────────────
const TOTAL_STEPS = 12;

const EXISTING_CONDITIONS = [
  'Diabetes', 'Hypertension', 'Thyroid', 'Heart Disease',
  'Asthma', 'Arthritis', 'PCOD/PCOS', 'None',
];

const FAMILY_HISTORY = [
  'Diabetes', 'Heart Disease', 'Cancer', 'Thyroid',
  'Hypertension', 'Stroke', 'None',
];

const HEALTH_GOALS = [
  'Weight Management', 'Better Sleep', 'Stress Relief',
  'Fitness', 'Better Nutrition', 'Chronic Condition Management',
  "Women's Health",
];

const DIET_TYPES = [
  'Balanced Diet', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Low Carb', 'Intermittent Fasting'
];

const DIET_PERSONALITIES = [
  { value: 'intuitive', label: 'Intuitive Eater', desc: 'Eat based on internal hunger cues' },
  { value: 'emotional', label: 'Emotional Eater', desc: 'Eat in response to feelings or stress' },
  { value: 'mindful', label: 'Mindful Nibbler', desc: 'Eat slowly, savoring every portion' },
  { value: 'fuel', label: 'Fitness Fueler', desc: 'Eat to optimize physical energy and performance' },
  { value: 'routine', label: 'Routine Eater', desc: 'Eat strict meals at exact scheduled times' },
];

const MOOD_BEHAVIORS = [
  'Calm & Focused', 'Stressed / Overwhelmed', 'Energetic',
  'Fatigued / Low Energy', 'Anxious', 'Mood Swings', 'Restless'
];

const FOCUS_AREAS = [
  'Gut & Digestion', 'Mental Health & Focus', 'Heart & Cardio',
  'Sleep Quality', 'Immune System', 'Joint & Muscle Strength'
];

const ACTIVITY_LEVELS: { value: QuizResponse['activityLevel']; label: string; icon: React.ReactNode }[] = [
  { value: 'sedentary', label: 'Sedentary', icon: <Moon className="h-4 w-4" /> },
  { value: 'light', label: 'Light', icon: <Activity className="h-4 w-4" /> },
  { value: 'moderate', label: 'Moderate', icon: <Activity className="h-4 w-4" /> },
  { value: 'active', label: 'Active', icon: <Activity className="h-4 w-4" /> },
];

const SMOKING_OPTIONS: { value: QuizResponse['smokingStatus']; label: string; icon: React.ReactNode }[] = [
  { value: 'never', label: 'Never', icon: <X className="h-4 w-4" /> },
  { value: 'former', label: 'Former', icon: <Cigarette className="h-4 w-4" /> },
  { value: 'current', label: 'Current', icon: <Cigarette className="h-4 w-4" /> },
];

const ALCOHOL_OPTIONS: { value: QuizResponse['alcoholConsumption']; label: string; icon: React.ReactNode }[] = [
  { value: 'none', label: 'None', icon: <X className="h-4 w-4" /> },
  { value: 'occasional', label: 'Occasional', icon: <Coffee className="h-4 w-4" /> },
  { value: 'moderate', label: 'Moderate', icon: <Coffee className="h-4 w-4" /> },
  { value: 'heavy', label: 'Heavy', icon: <Coffee className="h-4 w-4" /> },
];

// ─── Multi-select toggle badge ────────────────────────────────
function ToggleBadge({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Badge
      variant={selected ? 'default' : 'outline'}
      className={`cursor-pointer select-none px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl
        ${selected
          ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
          : 'hover:bg-teal-50 hover:border-teal-300 dark:hover:bg-teal-950 dark:hover:text-teal-200'
        }`}
      onClick={onToggle}
    >
      {selected && <Check className="mr-1 h-3 w-3 inline animate-scale" />}
      {label}
    </Badge>
  );
}

// ─── Quiz Screen Component ────────────────────────────────────
export default function QuizScreen() {
  const { setQuizData } = useQuizStore();
  const { setScreen } = useAppStore();

  // Local state for all quiz answers
  const [step, setStep] = useState(0);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<QuizResponse['gender']>();
  
  // BMI parameters
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  // Diet & Eating
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [dietTypePersonality, setDietTypePersonality] = useState('');
  const [mealCount, setMealCount] = useState(3);
  const [waterIntake, setWaterIntake] = useState(8);

  // Lifestyle & Habits
  const [moodBehavior, setMoodBehavior] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState<QuizResponse['stressLevel']>();
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [activityLevel, setActivityLevel] = useState<QuizResponse['activityLevel']>();
  const [smokingStatus, setSmokingStatus] = useState<QuizResponse['smokingStatus']>();
  const [alcoholConsumption, setAlcoholConsumption] = useState<QuizResponse['alcoholConsumption']>();
  const [sleepHours, setSleepHours] = useState(7);

  // Health Profile
  const [existingConditions, setExistingConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [medicationInput, setMedicationInput] = useState('');
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [focusArea, setFocusArea] = useState<string[]>([]);

  // Page View Logic
  const [showResults, setShowResults] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Toggle helpers
  const toggleItem = useCallback(
    (list: string[], setList: (v: string[]) => void, item: string) => {
      if (item === 'None') {
        setList(list.includes('None') ? [] : ['None']);
        return;
      }
      const filtered = list.filter((i) => i !== 'None');
      setList(filtered.includes(item) ? filtered.filter((i) => i !== item) : [...filtered, item]);
    },
    []
  );

  // Add medication
  const addMedication = useCallback(() => {
    const trimmed = medicationInput.trim();
    if (trimmed && !medications.includes(trimmed)) {
      setMedications((prev) => [...prev, trimmed]);
      setMedicationInput('');
    }
  }, [medicationInput, medications]);

  // Remove medication
  const removeMedication = useCallback((name: string) => {
    setMedications((prev) => prev.filter((m) => m !== name));
  }, []);

  // Dynamic calculations
  const calculatedBMI = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to m
    if (w > 0 && h > 0) {
      return parseFloat((w / (h * h)).toFixed(1));
    }
    return 0;
  }, [weight, height]);

  const bmiStatusLabel = useMemo((): 'underweight' | 'normal' | 'overweight' | 'obese' | null => {
    if (calculatedBMI === 0) return null;
    if (calculatedBMI < 18.5) return 'underweight';
    if (calculatedBMI < 25) return 'normal';
    if (calculatedBMI < 30) return 'overweight';
    return 'obese';
  }, [calculatedBMI]);

  // Validate current step
  const validateStep = useCallback((): boolean => {
    setValidationError('');
    switch (step) {
      case 0: {
        const ageNum = parseInt(age, 10);
        if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          setValidationError('Please enter a valid age (1-120)');
          return false;
        }
        if (!gender) {
          setValidationError('Please select your gender');
          return false;
        }
        return true;
      }
      case 1: {
        const wNum = parseFloat(weight);
        const hNum = parseFloat(height);
        if (!weight || isNaN(wNum) || wNum < 10 || wNum > 300) {
          setValidationError('Please enter a valid weight (10kg - 300kg)');
          return false;
        }
        if (!height || isNaN(hNum) || hNum < 50 || hNum > 250) {
          setValidationError('Please enter a valid height (50cm - 250cm)');
          return false;
        }
        return true;
      }
      case 2:
        if (!dietaryPreference) {
          setValidationError('Please select your dietary preference');
          return false;
        }
        if (!dietTypePersonality) {
          setValidationError('Please select your eating personality');
          return false;
        }
        return true;
      case 3:
        return true; // Meal count and Water defaults are valid
      case 4:
        if (moodBehavior.length === 0) {
          setValidationError('Please select at least one mood behavior trait');
          return false;
        }
        if (!stressLevel) {
          setValidationError('Please select your stress level');
          return false;
        }
        return true;
      case 5:
        if (!exerciseFrequency) {
          setValidationError('Please select your exercise frequency');
          return false;
        }
        if (!activityLevel) {
          setValidationError('Please select your typical activity level');
          return false;
        }
        return true;
      case 6:
        if (existingConditions.length === 0) {
          setValidationError('Please select at least one condition');
          return false;
        }
        return true;
      case 7:
        return true; // Medications is optional
      case 8:
        if (familyHistory.length === 0) {
          setValidationError('Please select family history conditions');
          return false;
        }
        return true;
      case 9:
        if (!alcoholConsumption) {
          setValidationError('Please select your alcohol consumption status');
          return false;
        }
        return true;
      case 10:
        if (healthGoals.length === 0) {
          setValidationError('Please select at least one health goal');
          return false;
        }
        return true;
      case 11:
        if (focusArea.length === 0) {
          setValidationError('Please select at least one focus area');
          return false;
        }
        return true;
      default:
        return true;
    }
  }, [
    step, age, gender, weight, height, dietaryPreference, dietTypePersonality,
    moodBehavior, stressLevel, exerciseFrequency, activityLevel,
    existingConditions, familyHistory, alcoholConsumption, healthGoals, focusArea
  ]);

  // Navigation
  const goNext = useCallback(() => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    }
  }, [step, validateStep]);

  const goBack = useCallback(() => {
    setValidationError('');
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  // Complete quiz
  const handleComplete = useCallback(() => {
    if (!validateStep()) return;
    setShowResults(true);
  }, [validateStep]);

  const saveAndExit = useCallback(() => {
    const quizResponse: QuizResponse = {
      age: parseInt(age, 10),
      gender,
      weight: parseFloat(weight),
      height: parseFloat(height),
      bmi: calculatedBMI,
      bmiStatus: bmiStatusLabel || undefined,
      dietaryPreference,
      dietTypePersonality,
      mealCount,
      waterIntake,
      moodBehavior,
      stressLevel,
      exerciseFrequency,
      activityLevel,
      smokingStatus,
      alcoholConsumption,
      sleepHours,
      existingConditions,
      medications,
      familyHistory,
      healthGoals,
      focusArea,
    };
    setQuizData(quizResponse);
    setScreen('login');
  }, [
    age, gender, weight, height, calculatedBMI, bmiStatusLabel,
    dietaryPreference, dietTypePersonality, mealCount, waterIntake,
    moodBehavior, stressLevel, exerciseFrequency, activityLevel,
    smokingStatus, alcoholConsumption, sleepHours, existingConditions,
    medications, familyHistory, healthGoals, focusArea, setQuizData, setScreen
  ]);

  const progressValue = ((step + 1) / TOTAL_STEPS) * 100;

  // ─── Step renderers ──────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // Step 0 - Basic Info
      case 0:
        return (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-semibold text-foreground">
                What is your age?
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setValidationError('');
                }}
                min={1}
                max={120}
                className="h-12 text-base rounded-xl"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-semibold text-foreground">
                What is your gender?
              </Label>
              <Select
                value={gender}
                onValueChange={(v: QuizResponse['gender']) => {
                  setGender(v);
                  setValidationError('');
                }}
              >
                <SelectTrigger className="h-12 text-base rounded-xl" id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      // Step 1 - Body Metrics
      case 1:
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-teal-600" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g. 75"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setValidationError('');
                  }}
                  className="h-12 text-base rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-teal-600" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g. 175"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    setValidationError('');
                  }}
                  className="h-12 text-base rounded-xl"
                />
              </div>
            </div>

            {calculatedBMI > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-teal-800 dark:text-teal-400 uppercase tracking-wide">
                    Estimated BMI
                  </p>
                  <p className="text-3xl font-black text-teal-600 dark:text-teal-300 mt-1">
                    {calculatedBMI}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={`px-3 py-1 rounded-full text-xs font-bold capitalize
                    ${bmiStatusLabel === 'normal' ? 'bg-green-500 text-white' : ''}
                    ${bmiStatusLabel === 'overweight' ? 'bg-amber-500 text-white' : ''}
                    ${bmiStatusLabel === 'obese' ? 'bg-rose-500 text-white' : ''}
                    ${bmiStatusLabel === 'underweight' ? 'bg-blue-500 text-white' : ''}
                  `}>
                    {bmiStatusLabel}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {bmiStatusLabel === 'normal' ? 'Healthy weight range' : 'Personal advice ready'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      // Step 2 - Diet Preference & Personality
      case 2:
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Utensils className="h-4 w-4 text-teal-600" />
                What is your dietary preference?
              </Label>
              <div className="flex flex-wrap gap-2">
                {DIET_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setDietaryPreference(type);
                      setValidationError('');
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200
                      ${dietaryPreference === type
                        ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        : 'border-border hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/50'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-teal-600" />
                Select your eating personality
              </Label>
              <div className="space-y-2">
                {DIET_PERSONALITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      setDietTypePersonality(p.value);
                      setValidationError('');
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-0.5
                      ${dietTypePersonality === p.value
                        ? 'border-teal-500 bg-teal-50/70 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        : 'border-border hover:border-teal-300 hover:bg-teal-50/30 dark:hover:bg-teal-950/30'
                      }`}
                  >
                    <span className="text-sm font-bold">{p.label}</span>
                    <span className="text-xs text-muted-foreground">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      // Step 3 - Eating Habits & Hydration
      case 3:
        return (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-teal-600" />
                How many meals do you consume per day?
              </Label>
              <div className="flex justify-between items-center gap-2 bg-muted/50 p-2 rounded-2xl border border-border/50">
                {[1, 2, 3, 4, 5].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMealCount(m)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200
                      ${mealCount === m
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'hover:bg-teal-50 dark:hover:bg-teal-950/45 text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {m} {m === 5 ? '5+' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Droplet className="h-4 w-4 text-teal-600" />
                Daily Water Intake: <span className="text-teal-600 dark:text-teal-400 font-extrabold">{waterIntake} Glasses</span>
              </Label>
              <div className="space-y-2">
                <input
                  type="range"
                  min={2}
                  max={16}
                  step={1}
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600 dark:bg-gray-700"
                  aria-label="Water intake slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2 Glasses (Dehydrated)</span>
                  <span>8 (Target)</span>
                  <span>16 Glasses</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      // Step 4 - Mood & Stress
      case 4:
        return (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Brain className="h-4 w-4 text-teal-600" />
                Select your general mood & energy levels (Select all)
              </Label>
              <div className="flex flex-wrap gap-2">
                {MOOD_BEHAVIORS.map((mood) => (
                  <ToggleBadge
                    key={mood}
                    label={mood}
                    selected={moodBehavior.includes(mood)}
                    onToggle={() => {
                      toggleItem(moodBehavior, setMoodBehavior, mood);
                      setValidationError('');
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                How would you rate your typical stress level?
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'moderate', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setStressLevel(lvl);
                      setValidationError('');
                    }}
                    className={`py-3.5 rounded-xl border text-sm font-bold capitalize transition-all duration-200
                      ${stressLevel === lvl
                        ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        : 'border-border hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/50'
                      }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      // Step 5 - Physical Activity
      case 5:
        return (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-teal-600" />
                How often do you exercise?
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {['Rarely', '1-2 times/week', '3-4 times/week', 'Daily'].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => {
                      setExerciseFrequency(freq);
                      setValidationError('');
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200
                      ${exerciseFrequency === freq
                        ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        : 'border-border hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/50'
                      }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Select your work/activity routine
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVITY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => {
                      setActivityLevel(level.value);
                      setValidationError('');
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-sm font-medium transition-all duration-200
                      ${activityLevel === level.value
                        ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        : 'border-border hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/50'
                      }`}
                  >
                    {level.icon}
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      // Step 6 - Existing Conditions
      case 6:
        return (
          <motion.div
            key="step-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Label className="text-sm font-semibold text-foreground">
              Select any existing health conditions
            </Label>
            <div className="flex flex-wrap gap-2">
              {EXISTING_CONDITIONS.map((condition) => (
                <ToggleBadge
                  key={condition}
                  label={condition}
                  selected={existingConditions.includes(condition)}
                  onToggle={() => {
                    toggleItem(existingConditions, setExistingConditions, condition);
                    setValidationError('');
                  }}
                />
              ))}
            </div>
          </motion.div>
        );

      // Step 7 - Current Medications
      case 7:
        return (
          <motion.div
            key="step-7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Label className="text-sm font-semibold text-foreground">
              Add any prescription medications you are currently taking
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Medication name"
                value={medicationInput}
                onChange={(e) => setMedicationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addMedication();
                  }
                }}
                className="h-12 text-base rounded-xl"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0 border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950 rounded-xl"
                onClick={addMedication}
                aria-label="Add medication"
              >
                <Plus className="h-5 w-5 text-teal-600" />
              </Button>
            </div>
            {medications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medications.map((med) => (
                  <Badge
                    key={med}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm font-medium bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200 border border-teal-100 rounded-xl"
                  >
                    {med}
                    <button
                      type="button"
                      onClick={() => removeMedication(med)}
                      className="ml-1.5 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800 p-0.5 transition-colors"
                      aria-label={`Remove ${med}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {medications.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                No medications added — click &quot;Continue&quot; if none apply
              </p>
            )}
          </motion.div>
        );

      // Step 8 - Family History
      case 8:
        return (
          <motion.div
            key="step-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Label className="text-sm font-semibold text-foreground">
              Select conditions that run in your immediate family
            </Label>
            <div className="flex flex-wrap gap-2">
              {FAMILY_HISTORY.map((condition) => (
                <ToggleBadge
                  key={condition}
                  label={condition}
                  selected={familyHistory.includes(condition)}
                  onToggle={() => {
                    toggleItem(familyHistory, setFamilyHistory, condition);
                    setValidationError('');
                  }}
                />
              ))}
            </div>
          </motion.div>
        );

      // Step 9 - Sleep & Habits
      case 9:
        return (
          <motion.div
            key="step-9"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Sleep Hours */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Moon className="h-4 w-4 text-teal-600" />
                Average Sleep: <span className="text-teal-600 dark:text-teal-400 font-extrabold">{sleepHours} Hours</span>
              </Label>
              <div className="space-y-2">
                <input
                  type="range"
                  min={4}
                  max={12}
                  step={0.5}
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600 dark:bg-gray-700"
                  aria-label="Sleep hours slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>4h</span>
                  <span>8h (Healthy)</span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            {/* Smoking */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Smoking Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {SMOKING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSmokingStatus(opt.value)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all duration-200
                      ${smokingStatus === opt.value
                        ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        : 'border-border hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/50'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alcohol */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Alcohol consumption</Label>
              <div className="grid grid-cols-4 gap-2">
                {ALCOHOL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setAlcoholConsumption(opt.value);
                      setValidationError('');
                    }}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-medium transition-all duration-200
                      ${alcoholConsumption === opt.value
                        ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        : 'border-border hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/50'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      // Step 10 - Health Goals
      case 10:
        return (
          <motion.div
            key="step-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Label className="text-sm font-semibold text-foreground">
              What are your primary health and wellness goals?
            </Label>
            <div className="flex flex-wrap gap-2">
              {HEALTH_GOALS.map((goal) => (
                <ToggleBadge
                  key={goal}
                  label={goal}
                  selected={healthGoals.includes(goal)}
                  onToggle={() => {
                    toggleItem(healthGoals, setHealthGoals, goal);
                    setValidationError('');
                  }}
                />
              ))}
            </div>
          </motion.div>
        );

      // Step 11 - Focus Area
      case 11:
        return (
          <motion.div
            key="step-11"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Label className="text-sm font-semibold text-foreground">
              Select specific areas you want to prioritize
            </Label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map((item) => (
                <ToggleBadge
                  key={item}
                  label={item}
                  selected={focusArea.includes(item)}
                  onToggle={() => {
                    toggleItem(focusArea, setFocusArea, item);
                    setValidationError('');
                  }}
                />
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Step titles
  const stepTitles: string[] = [
    'Basic Information',
    'Body Metrics',
    'Dietary Profile',
    'Daily Eating & Water',
    'Mood & Mental Energy',
    'Exercise & Activity',
    'Health Conditions',
    'Current Medications',
    'Family Medical History',
    'Habits & Sleep Tracker',
    'Health Goals',
    'Personal Focus Areas',
  ];

  // ─── Results Generation Helper ──────────────────────────────
  const renderResults = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto space-y-6 px-4 py-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 mb-2">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            Your Health Profile
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            We have generated a personalized report based on your profile inputs.
          </p>
        </div>

        {/* BMI Card */}
        <Card className="border-border/50 shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-950/20 dark:to-emerald-950/20 pb-4 border-b border-border/50">
            <CardTitle className="text-md font-bold text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-teal-600" />
              Body Mass Index (BMI) Report
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Calculated BMI</p>
                <p className="text-4xl font-black text-foreground mt-1">
                  {calculatedBMI}
                </p>
              </div>
              <div className="text-right">
                <Badge className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                  ${bmiStatusLabel === 'normal' ? 'bg-green-500 text-white shadow-sm' : ''}
                  ${bmiStatusLabel === 'overweight' ? 'bg-amber-500 text-white shadow-sm' : ''}
                  ${bmiStatusLabel === 'obese' ? 'bg-rose-500 text-white shadow-sm' : ''}
                  ${bmiStatusLabel === 'underweight' ? 'bg-blue-500 text-white shadow-sm' : ''}
                `}>
                  {bmiStatusLabel}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Height: {height}cm | Weight: {weight}kg
                </p>
              </div>
            </div>

            {/* Visual scale */}
            <div className="space-y-1.5 pt-2">
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-400" style={{ width: '18.5%' }} />
                <div className="h-full bg-green-500" style={{ width: '25%' }} />
                <div className="h-full bg-amber-500" style={{ width: '20%' }} />
                <div className="h-full bg-rose-500" style={{ width: '36.5%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground px-1 font-bold">
                <span>&lt;18.5 (Under)</span>
                <span>18.5-24.9 (Normal)</span>
                <span>25-29.9 (Over)</span>
                <span>30+ (Obese)</span>
              </div>
            </div>

            {/* Personalized BMI message */}
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border/40 text-xs leading-relaxed text-muted-foreground">
              {bmiStatusLabel === 'normal' && (
                <span>🎉 Great! You are in the <strong>Healthy Weight</strong> category. Keeping a stable diet and regular exercises will sustain this.</span>
              )}
              {bmiStatusLabel === 'overweight' && (
                <span>⚠️ You are categorized as <strong>Overweight</strong>. We recommend managing your calorie balance, tracking daily steps, and focusing on fiber-rich nutrient foods.</span>
              )}
              {bmiStatusLabel === 'obese' && (
                <span>🚨 You are in the <strong>Obese</strong> weight category. Medpac can assist with personalized exercises and medical-approved meals. Consulting a doctor is highly recommended.</span>
              )}
              {bmiStatusLabel === 'underweight' && (
                <span>⚠️ You are categorized as <strong>Underweight</strong>. Focus on consuming calorie-dense foods, building lean muscle mass, and maintaining balanced proteins.</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dietary & Eating Personality Card */}
        <Card className="border-border/50 shadow-md rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Utensils className="h-4 w-4 text-teal-600" />
              Nutritional Personality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Diet Preference</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">{dietaryPreference}</span>
              </div>
              <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Eating Style</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block capitalize">{dietTypePersonality} Eater</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-teal-50/30 dark:bg-teal-950/10 p-3 rounded-xl border border-teal-500/10 flex items-start gap-2">
              <Clock className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong>Meal Schedule Tip:</strong> Spacing your <strong>{mealCount} daily meals</strong> at 4-5 hour intervals while drinking your target of <strong>{waterIntake} glasses of water</strong> will optimize metabolic health and digestion.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood & Energy Behaviour */}
        <Card className="border-border/50 shadow-md rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Brain className="h-4 w-4 text-teal-600" />
              Behavioral & Mental Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-semibold text-muted-foreground block mb-1.5">Identified Mood Indicators</span>
              <div className="flex flex-wrap gap-1.5">
                {moodBehavior.map((mood) => (
                  <Badge key={mood} variant="outline" className="px-2.5 py-1 text-xs rounded-lg font-medium text-foreground bg-muted/20 border-border/55">
                    {mood}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Sleep Goal Status</span>
                <span className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1">
                  <Moon className="h-3.5 w-3.5 text-teal-500" />
                  {sleepHours}h / night ({sleepHours >= 7 ? 'Optimal' : 'Insufficient'})
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Stress Level</span>
                <span className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                  <span className="capitalize">{stressLevel}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Focus Areas */}
        <Card className="border-border/50 shadow-md rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-600" />
              Your Focus Priorities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="flex flex-wrap gap-1.5">
              {focusArea.map((item) => (
                <Badge key={item} className="px-3 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-semibold hover:bg-teal-500/15 border border-teal-500/20">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed p-3 bg-muted/40 rounded-xl">
              🎯 <strong>Medpac Recommendation:</strong> We have tailored your dashboard widgets and AI health assistants to prioritize resources regarding {focusArea.join(', ')}.
            </div>
          </CardContent>
        </Card>

        {/* Final Button */}
        <div className="pt-2">
          <Button
            onClick={saveAndExit}
            className="w-full h-14 text-base font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg shadow-teal-600/10 flex items-center justify-center gap-2"
          >
            Create Personalized Account
            <ArrowRight className="h-5 w-5" />
          </Button>
          <button
            type="button"
            onClick={() => {
              setShowResults(false);
              setStep(0);
            }}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-4 font-semibold transition-colors"
          >
            Go back and change responses
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/20 dark:from-gray-950 dark:to-teal-950/5 flex flex-col">
      {showResults ? (
        renderResults()
      ) : (
        <>
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-border/50 px-4 py-4">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
                    <Heart className="h-4 w-4 text-white" fill="currentColor" />
                  </div>
                  <h1 className="text-md font-bold text-foreground">
                    Health Personalization
                  </h1>
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border/50">
                  Step {step + 1} of {TOTAL_STEPS}
                </span>
              </div>
              <Progress value={progressValue} className="h-1.5 accent-teal-600 [&>div]:bg-teal-600" />
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 py-8 overflow-y-auto">
            <div className="max-w-lg mx-auto">
              <AnimatePresence mode="wait">
                <Card className="border-border/50 shadow-xl shadow-teal-500/5 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-foreground">
                      {stepTitles[step]}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Provide accurate responses for a fully customized health dashboard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderStep()}

                    {/* Validation error */}
                    {validationError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-sm font-semibold text-red-500 dark:text-red-400 flex items-center gap-1.5"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        {validationError}
                      </motion.p>
                    )}
                  </CardContent>
                </Card>
              </AnimatePresence>
            </div>
          </main>

          {/* Footer buttons */}
          <footer className="sticky bottom-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-border/50 px-4 py-4">
            <div className="max-w-lg mx-auto flex gap-3">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={step === 0}
                className="flex-1 h-12 text-base rounded-xl font-semibold border-border hover:bg-muted"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              {step < TOTAL_STEPS - 1 ? (
                <Button
                  onClick={goNext}
                  className="flex-1 h-12 text-base bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold"
                >
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="flex-1 h-12 text-base bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-md shadow-teal-600/10"
                >
                  <Check className="mr-1.5 h-5 w-5" />
                  View Report
                </Button>
              )}
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
