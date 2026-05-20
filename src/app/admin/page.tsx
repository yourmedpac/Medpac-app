"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Activity, 
  FileText, 
  Pill, 
  LogOut, 
  Trash2, 
  Eye, 
  ShieldAlert, 
  Search, 
  RefreshCw,
  UserCheck,
  Calendar,
  Sparkles,
  ClipboardList,
  Heart,
  User,
  Phone,
  Mail,
  AlertTriangle
} from "lucide-react";

interface UserProfile {
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bmiCategory?: string;
  dietaryPreference?: string;
  dietTypePersonality?: string;
  mealCount?: number;
  waterIntake?: number;
  stressLevel?: string;
  exerciseFrequency?: string;
  activityLevel?: string;
  sleepHours?: number;
  smokingStatus?: string;
  alcoholConsumption?: string;
  existingConditions: string[];
  medications: string[];
  familyHistory: string[];
  healthGoals: string[];
  focusArea: string[];
}

interface UserReport {
  id: string;
  fileName: string;
  riskLevel: string;
  createdAt: string;
}

interface UserMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

interface UserVital {
  id: string;
  type: string;
  value: string;
  unit: string;
  timestamp: string;
}

interface UserConsultation {
  id: string;
  doctorName: string;
  specialty: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  isQuizCompleted: boolean;
  createdAt: string;
  profile?: UserProfile | null;
  reports?: UserReport[];
  medications?: UserMedication[];
  vitals?: UserVital[];
  consultations?: UserConsultation[];
}

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("yourmedpac@gmail.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dashboard state
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDeletingUserId, setIsDeletingUserId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Read token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("medpac_admin_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Fetch users when token or refreshKey changes
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setUsers(data.users);
        } else {
          setError(data.error || "Failed to fetch users");
          if (res.status === 401 || res.status === 403) {
            handleLogout();
          }
        }
      } catch (err) {
        setError("Network error while fetching system data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token, refreshKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("medpac_admin_token", data.token);
        setToken(data.token);
        setError(null);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("medpac_admin_token");
    setToken(null);
    setUsers([]);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userIdToDelete: string) => {
    if (!token) return;
    if (!confirm("Are you absolutely sure you want to delete this user and all their health history? This cannot be undone.")) return;

    setIsDeletingUserId(userIdToDelete);
    try {
      const res = await fetch(`/api/admin/users?id=${userIdToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(users.filter(u => u.id !== userIdToDelete));
        if (selectedUser?.id === userIdToDelete) {
          setSelectedUser(null);
          setShowProfileModal(false);
        }
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Error deleting user");
    } finally {
      setIsDeletingUserId(null);
    }
  };

  // Filtered users search
  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(q) ||
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.phone && user.phone.includes(q)) ||
      user.id.toLowerCase().includes(q)
    );
  });

  // Calculate system metrics
  const totalUsers = users.length;
  const quizCompletedCount = users.filter(u => u.isQuizCompleted).length;
  const totalReportsCount = users.reduce((acc, curr) => acc + (curr.reports?.length || 0), 0);
  const totalMedicationsCount = users.reduce((acc, curr) => acc + (curr.medications?.length || 0), 0);
  const totalVitalsCount = users.reduce((acc, curr) => acc + (curr.vitals?.length || 0), 0);

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden p-4">
        {/* Decorative elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-4">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Medpac Health OS</h1>
            <p className="text-slate-400 text-sm mt-1">Administrative Terminal Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@medpac.in"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/30 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Secure Passcode</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/30 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Decrypt & Log In</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/40 backdrop-blur-xl border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Medpac OS</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Admin Panel v1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            disabled={isLoading}
            className="p-2 hover:bg-slate-800/60 rounded-xl transition-colors border border-slate-900 text-slate-400 hover:text-white cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin text-teal-400" : ""}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-xl transition-all border border-red-950 text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminal Exit</span>
          </button>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        
        {/* Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Enrolled</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Registered users</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Quiz Completed</span>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{quizCompletedCount}</h3>
              <p className="text-[10px] text-slate-500 mt-1">
                {totalUsers > 0 ? Math.round((quizCompletedCount / totalUsers) * 100) : 0}% completion rate
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Report Analytics</span>
              <FileText className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{totalReportsCount}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Total analyzed PDFs/images</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Medications Log</span>
              <Pill className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{totalMedicationsCount}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Active medication tracking</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-900/40 border border-slate-900 rounded-2xl col-span-2 md:col-span-1 p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Vitals Recorded</span>
              <Activity className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{totalVitalsCount}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Total biometrics readings</p>
            </div>
          </motion.div>
        </section>

        {/* Users Table & Filters */}
        <section className="bg-slate-900/20 border border-slate-900/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-900/80 bg-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">System Diagnostics & Patient Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Audit user accounts, vitals databases, and clinical profiles</p>
            </div>
            
            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full bg-slate-950/60 border border-slate-900/80 focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading && users.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-teal-500" />
                <p className="text-sm">Querying secure records database...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-sm">
                No patient records match the specified query parameters.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900/60 text-slate-400 text-xs font-semibold bg-slate-950/20 uppercase tracking-wider">
                    <th className="py-4 px-6">Patient User</th>
                    <th className="py-4 px-6">Contact / Details</th>
                    <th className="py-4 px-6 text-center">Quiz</th>
                    <th className="py-4 px-6 text-center">Diagnostics Counts</th>
                    <th className="py-4 px-6">Enrolled Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/30 text-sm text-slate-300">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700/50 text-slate-200 font-semibold">
                            {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{user.name || "Anonymous Patient"}</div>
                            <div className="text-slate-500 text-xs font-mono">{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-center">
                        {user.isQuizCompleted ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-3.5 text-slate-400 text-xs">
                          <span className="flex items-center gap-1" title="Vitals count">
                            <Activity className="w-3.5 h-3.5 text-rose-500" />
                            <span>{user.vitals?.length || 0}</span>
                          </span>
                          <span className="flex items-center gap-1" title="Medications count">
                            <Pill className="w-3.5 h-3.5 text-yellow-500" />
                            <span>{user.medications?.length || 0}</span>
                          </span>
                          <span className="flex items-center gap-1" title="Medical reports count">
                            <FileText className="w-3.5 h-3.5 text-purple-500" />
                            <span>{user.reports?.length || 0}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowProfileModal(true);
                            }}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Inspect Profile & Logs"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isDeletingUserId === user.id}
                            className="p-1.5 hover:bg-red-950/60 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            {isDeletingUserId === user.id ? (
                              <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-4.5 h-4.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Profile Inspector Modal */}
      <AnimatePresence>
        {showProfileModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 text-white text-lg font-bold">
                    {selectedUser.name ? selectedUser.name[0].toUpperCase() : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedUser.name || "Anonymous Patient"}</h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedUser.email} • ID: {selectedUser.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
                >
                  Close Portal
                </button>
              </div>

              {/* Modal Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Panel: Quiz Profile */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                      <ClipboardList className="w-4 h-4 text-teal-400" />
                      <span>Quiz & Health Profile Information</span>
                    </h3>
                    
                    {selectedUser.isQuizCompleted && selectedUser.profile ? (
                      <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-5 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <div className="text-slate-500">Age / Gender</div>
                          <div className="text-slate-200 mt-0.5 font-medium">
                            {selectedUser.profile.age || "N/A"} yrs / {selectedUser.profile.gender || "N/A"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Weight / Height</div>
                          <div className="text-slate-200 mt-0.5 font-medium">
                            {selectedUser.profile.weight || "N/A"} kg / {selectedUser.profile.height || "N/A"} cm
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">BMI Index</div>
                          <div className="text-slate-200 mt-0.5 font-medium">
                            {selectedUser.profile.bmi || "N/A"}{" "}
                            {selectedUser.profile.bmiCategory && (
                              <span className="text-[10px] text-slate-400">({selectedUser.profile.bmiCategory})</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Diet & Personality</div>
                          <div className="text-slate-200 mt-0.5 font-medium">
                            {selectedUser.profile.dietaryPreference || "N/A"}{" "}
                            {selectedUser.profile.dietTypePersonality && (
                              <span className="text-[10px] text-slate-400">({selectedUser.profile.dietTypePersonality})</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Hydration & Meals</div>
                          <div className="text-slate-200 mt-0.5 font-medium">
                            {selectedUser.profile.waterIntake || "N/A"} L/day • {selectedUser.profile.mealCount || "N/A"} meals
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Sleep / Activity</div>
                          <div className="text-slate-200 mt-0.5 font-medium">
                            {selectedUser.profile.sleepHours || "N/A"} hrs • {selectedUser.profile.activityLevel || "N/A"}
                          </div>
                        </div>
                        
                        <div className="col-span-2 md:col-span-3 border-t border-slate-900 pt-4 space-y-3">
                          {selectedUser.profile.existingConditions.length > 0 && (
                            <div>
                              <div className="text-slate-500 font-semibold mb-1">Existing Conditions:</div>
                              <div className="flex flex-wrap gap-1">
                                {selectedUser.profile.existingConditions.map((c, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-950 text-[10px] font-semibold">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedUser.profile.medications.length > 0 && (
                            <div>
                              <div className="text-slate-500 font-semibold mb-1">Active Medications (Reported):</div>
                              <div className="flex flex-wrap gap-1">
                                {selectedUser.profile.medications.map((m, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-yellow-950/40 text-yellow-400 border border-yellow-950/80 text-[10px] font-semibold">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedUser.profile.healthGoals.length > 0 && (
                            <div>
                              <div className="text-slate-500 font-semibold mb-1">Primary Health Goals:</div>
                              <div className="flex flex-wrap gap-1">
                                {selectedUser.profile.healthGoals.map((g, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-950 text-[10px] font-semibold">
                                    {g}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs">
                        This user has not completed the onboarding health quiz. No profile metrics available.
                      </div>
                    )}
                  </div>

                  {/* Vitals logs table */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                      <Activity className="w-4 h-4 text-rose-500" />
                      <span>Biometric Vital Readings Log</span>
                    </h3>
                    {selectedUser.vitals && selectedUser.vitals.length > 0 ? (
                      <div className="bg-slate-950/40 border border-slate-850 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-950/40 border-b border-slate-850 text-slate-500 font-semibold">
                              <th className="py-2.5 px-4">Vital Sign</th>
                              <th className="py-2.5 px-4 text-center">Reading Value</th>
                              <th className="py-2.5 px-4 text-right">Time Recorded</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900/30 text-slate-350">
                            {selectedUser.vitals.map((v) => (
                              <tr key={v.id}>
                                <td className="py-2 px-4 font-medium text-slate-200">
                                  {v.type.replace("_", " ")}
                                </td>
                                <td className="py-2 px-4 text-center text-rose-400 font-semibold">
                                  {v.value} <span className="text-[10px] text-slate-500 font-normal">{v.unit}</span>
                                </td>
                                <td className="py-2 px-4 text-right text-slate-500 text-[10px]">
                                  {new Date(v.timestamp).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs">
                        No telemetry or vital records logged for this user.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel: Medications & Reports & Consults list */}
                <div className="space-y-6">
                  {/* Consultations tracking */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>Telemedicine Consults</span>
                    </h3>
                    {selectedUser.consultations && selectedUser.consultations.length > 0 ? (
                      <div className="space-y-2.5">
                        {selectedUser.consultations.map((c) => (
                          <div key={c.id} className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 text-xs">
                            <div className="font-semibold text-slate-100 flex justify-between">
                              <span>Dr. {c.doctorName}</span>
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                c.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 
                                c.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {c.status}
                              </span>
                            </div>
                            <div className="text-slate-400 mt-1 flex justify-between items-center">
                              <span>{c.specialty}</span>
                              <span className="text-slate-500 font-mono text-[10px]">{c.timeSlot}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs">
                        No online consultations booked.
                      </div>
                    )}
                  </div>

                  {/* Medications tracking */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                      <Pill className="w-4 h-4 text-yellow-500" />
                      <span>Tracked Medications</span>
                    </h3>
                    {selectedUser.medications && selectedUser.medications.length > 0 ? (
                      <div className="space-y-2.5">
                        {selectedUser.medications.map((m) => (
                          <div key={m.id} className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 text-xs">
                            <div className="font-semibold text-slate-100">{m.name}</div>
                            <div className="text-slate-400 mt-1 flex justify-between">
                              <span>Dosage: {m.dosage}</span>
                              <span className="text-slate-500 font-mono text-[10px]">{m.frequency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs">
                        No active clinical medications entered.
                      </div>
                    )}
                  </div>

                  {/* Medical reports */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span>Analyzed Diagnostics Reports</span>
                    </h3>
                    {selectedUser.reports && selectedUser.reports.length > 0 ? (
                      <div className="space-y-2.5">
                        {selectedUser.reports.map((r) => (
                          <div key={r.id} className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 text-xs flex justify-between items-center gap-3">
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-100 truncate" title={r.fileName}>
                                {r.fileName}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1">
                                Analyzed on: {new Date(r.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            {r.riskLevel.toLowerCase() === "high" || r.riskLevel.toLowerCase() === "critical" || r.riskLevel.toLowerCase() === "action" ? (
                              <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-950 text-[10px] font-semibold flex-shrink-0">
                                Action
                              </span>
                            ) : r.riskLevel.toLowerCase() === "moderate" || r.riskLevel.toLowerCase() === "attention" ? (
                              <span className="px-2 py-0.5 rounded bg-yellow-950/40 text-yellow-400 border border-yellow-950/80 text-[10px] font-semibold flex-shrink-0">
                                Attention
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-950 text-[10px] font-semibold flex-shrink-0">
                                Normal
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs">
                        No health reports or imaging uploaded.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
