import { create } from 'zustand';
import type {
  Screen, User, QuizResponse, Medicine, CartItem,
  FamilyMember, Reminder, HealthRecord, ChatMessage,
  Doctor, Prescription, Notification, ReportAnalysis
} from './types';

// ─── App Navigation Store ─────────────────────────────────
interface AppStore {
  screen: Screen;
  setScreen: (s: Screen) => void;
  previousScreen: Screen | null;
  goBack: () => void;
  selectedMedicineId: string | null;
  setSelectedMedicineId: (id: string | null) => void;
  selectedFamilyMemberId: string | null;
  setSelectedFamilyMemberId: (id: string | null) => void;
}
export const useAppStore = create<AppStore>((set, get) => ({
  screen: 'splash',
  setScreen: (s) => set({ previousScreen: get().screen, screen: s }),
  previousScreen: null,
  goBack: () => {
    const { previousScreen } = get();
    if (previousScreen) set({ screen: previousScreen, previousScreen: null });
  },
  selectedMedicineId: null,
  setSelectedMedicineId: (id) => set({ selectedMedicineId: id }),
  selectedFamilyMemberId: null,
  setSelectedFamilyMemberId: (id) => set({ selectedFamilyMemberId: id }),
}));

// ─── Auth Store ───────────────────────────────────────────
interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}
export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  updateUser: (data) => set((s) => ({
    user: s.user ? { ...s.user, ...data } : null
  })),
}));

// ─── Quiz Store ───────────────────────────────────────────
interface QuizStore {
  quizCompleted: boolean;
  quizData: QuizResponse | null;
  setQuizData: (data: QuizResponse) => void;
  currentQuizStep: number;
  setQuizStep: (step: number) => void;
}
export const useQuizStore = create<QuizStore>((set) => ({
  quizCompleted: false,
  quizData: null,
  setQuizData: (data) => set({ quizCompleted: true, quizData: data }),
  currentQuizStep: 0,
  setQuizStep: (step) => set({ currentQuizStep: step }),
}));

// ─── Cart Store ───────────────────────────────────────────
interface CartStore {
  items: CartItem[];
  addItem: (medicine: Medicine, qty?: number) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (medicine, qty = 1) => set((s) => {
    const existing = s.items.find(i => i.medicine.id === medicine.id);
    if (existing) {
      return {
        items: s.items.map(i =>
          i.medicine.id === medicine.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        ),
      };
    }
    return { items: [...s.items, { medicine, quantity: qty }] };
  }),
  removeItem: (medicineId) => set((s) => ({
    items: s.items.filter(i => i.medicine.id !== medicineId),
  })),
  updateQuantity: (medicineId, qty) => set((s) => ({
    items: qty <= 0
      ? s.items.filter(i => i.medicine.id !== medicineId)
      : s.items.map(i =>
          i.medicine.id === medicineId ? { ...i, quantity: qty } : i
        ),
  })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + (i.medicine.discountPrice || i.medicine.price) * i.quantity, 0),
}));

// ─── Family Store ─────────────────────────────────────────
interface FamilyStore {
  members: FamilyMember[];
  addMember: (member: FamilyMember) => void;
  updateMember: (id: string, data: Partial<FamilyMember>) => void;
  removeMember: (id: string) => void;
}
export const useFamilyStore = create<FamilyStore>((set) => ({
  members: [],
  addMember: (member) => set((s) => ({ members: [...s.members, member] })),
  updateMember: (id, data) => set((s) => ({
    members: s.members.map(m => m.id === id ? { ...m, ...data } : m),
  })),
  removeMember: (id) => set((s) => ({
    members: s.members.filter(m => m.id !== id),
  })),
}));

// ─── Reminders Store ──────────────────────────────────────
interface ReminderStore {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, data: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
}
export const useReminderStore = create<ReminderStore>((set) => ({
  reminders: [],
  addReminder: (reminder) => set((s) => ({ reminders: [...s.reminders, reminder] })),
  updateReminder: (id, data) => set((s) => ({
    reminders: s.reminders.map(r => r.id === id ? { ...r, ...data } : r),
  })),
  deleteReminder: (id) => set((s) => ({
    reminders: s.reminders.filter(r => r.id !== id),
  })),
  toggleReminder: (id) => set((s) => ({
    reminders: s.reminders.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r),
  })),
}));

// ─── Health Vault Store ───────────────────────────────────
interface HealthVaultStore {
  records: HealthRecord[];
  addRecord: (record: HealthRecord) => void;
  deleteRecord: (id: string) => void;
  reportAnalyses: ReportAnalysis[];
  addReportAnalysis: (analysis: ReportAnalysis) => void;
}
export const useHealthVaultStore = create<HealthVaultStore>((set) => ({
  records: [],
  addRecord: (record) => set((s) => ({ records: [record, ...s.records] })),
  deleteRecord: (id) => set((s) => ({
    records: s.records.filter(r => r.id !== id),
  })),
  reportAnalyses: [],
  addReportAnalysis: (analysis) => set((s) => ({
    reportAnalyses: [analysis, ...s.reportAnalyses],
  })),
}));

// ─── Chat Store ───────────────────────────────────────────
interface ChatStore {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  clearChat: () => void;
  isLoading: boolean;
  setLoading: (v: boolean) => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateLastMessage: (content) => set((s) => {
    const msgs = [...s.messages];
    if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
      msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content, isTyping: false };
    }
    return { messages: msgs };
  }),
  clearChat: () => set({ messages: [] }),
  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),
}));

// ─── Notifications Store ──────────────────────────────────
interface NotificationStore {
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}
export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
  markRead: (id) => set((s) => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map(n => ({ ...n, read: true })),
  })),
  unreadCount: () => get().notifications.filter(n => !n.read).length,
}));

// ─── Prescriptions Store ──────────────────────────────────
interface PrescriptionStore {
  prescriptions: Prescription[];
  addPrescription: (p: Prescription) => void;
}
export const usePrescriptionStore = create<PrescriptionStore>((set) => ({
  prescriptions: [],
  addPrescription: (p) => set((s) => ({ prescriptions: [p, ...s.prescriptions] })),
}));
