export type Screen =
  | 'splash'
  | 'onboarding'
  | 'quiz'
  | 'login'
  | 'otp'
  | 'home'
  | 'ai-assistant'
  | 'medicine'
  | 'medicine-detail'
  | 'cart'
  | 'prescription'
  | 'family'
  | 'health-vault'
  | 'report-analyzer'
  | 'reminders'
  | 'telemedicine'
  | 'diagnostics'
  | 'subscriptions'
  | 'profile'
  | 'settings'
  | 'notifications';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: string;
  createdAt: string;
}

export interface QuizResponse {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  existingConditions: string[];
  medications: string[];
  familyHistory: string[];
  healthGoals: string[];
  dietaryPreference?: string;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active';
  smokingStatus?: 'never' | 'former' | 'current';
  alcoholConsumption?: 'none' | 'occasional' | 'moderate' | 'heavy';
  sleepHours?: number;
  stressLevel?: 'low' | 'moderate' | 'high';
  weight?: number;
  height?: number;
  bmi?: number;
  bmiStatus?: 'underweight' | 'normal' | 'overweight' | 'obese';
  dietTypePersonality?: string;
  moodBehavior?: string[];
  mealCount?: number;
  waterIntake?: number;
  exerciseFrequency?: string;
  focusArea?: string[];
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  price: number;
  discountPrice?: number;
  dosageForm: string;
  strength: string;
  packSize: string;
  category: string;
  prescription: boolean;
  description: string;
  uses: string[];
  sideEffects: string[];
  inStock: boolean;
  rating: number;
  image?: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  allergies?: string[];
  conditions?: string[];
  avatar?: string;
}

export interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  memberId?: string;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  type: 'lab_report' | 'prescription' | 'imaging' | 'discharge_summary' | 'vaccination' | 'other';
  title: string;
  date: string;
  provider: string;
  fileUrl?: string;
  aiSummary?: string;
  tags: string[];
  memberId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  rating: number;
  consultationFee: number;
  availableSlots: string[];
  image?: string;
  languages: string[];
  online: boolean;
}

export interface DiagnosticCenter {
  id: string;
  name: string;
  address: string;
  rating: number;
  tests: DiagnosticTest[];
  image?: string;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  turnaround: string;
  preparation?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  condition: string;
  price: number;
  features: string[];
  duration: string;
  popular?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'report' | 'promotion' | 'appointment' | 'system';
  read: boolean;
  timestamp: string;
}

export interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  notes?: string;
  hospital?: string;
  fileUrl?: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface ReportAnalysis {
  id: string;
  fileName: string;
  uploadDate: string;
  summary: string;
  findings: ReportFinding[];
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  originalText?: string;
}

export interface ReportFinding {
  parameter: string;
  value: string;
  normalRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
  interpretation: string;
}
