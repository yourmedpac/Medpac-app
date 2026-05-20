'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore, useAuthStore } from '@/lib/store';

// ─── Google Icon SVG ──────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginScreen() {
  const { setScreen } = useAppStore();
  const { login } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState(false);

  const validatePhone = useCallback((p: string): boolean => {
    const cleaned = p.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^[6-9]/.test(cleaned)) {
      setError('Indian mobile numbers must start with 6-9');
      return false;
    }
    setError('');
    return true;
  }, []);

  const handleSendOTP = useCallback(() => {
    if (!validatePhone(phone)) return;
    setIsLoading(true);
    // Store phone in sessionStorage for OTP screen to read
    sessionStorage.setItem('medpac_phone', phone);
    // Simulate a brief loading state
    setTimeout(() => {
      setIsLoading(false);
      setScreen('otp');
    }, 800);
  }, [phone, validatePhone, setScreen]);

  const handlePhoneChange = useCallback((value: string) => {
    // Only allow digits, max 10
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    if (error) setError('');
  }, [error]);

  const handleGoogleLogin = useCallback(() => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      const user = {
        id: 'user_google',
        name: 'Arjun Mehta',
        phone: '9876543210',
        createdAt: new Date().toISOString(),
      };
      login(user);
      setScreen('home');
    }, 1000);
  }, [login, setScreen]);

  const handleWhatsAppLogin = useCallback(() => {
    setIsWhatsAppLoading(true);
    setTimeout(() => {
      setIsWhatsAppLoading(false);
      const user = {
        id: 'user_whatsapp',
        name: 'Arjun Mehta',
        phone: '9876543210',
        createdAt: new Date().toISOString(),
      };
      login(user);
      setScreen('home');
    }, 1000);
  }, [login, setScreen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 dark:from-gray-950 dark:to-emerald-950/10 flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
            className="relative mb-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Heart className="h-10 w-10 text-white" fill="currentColor" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-400 shadow-sm animate-pulse" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to Medpac
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Sign in to access your health ecosystem
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-lg shadow-emerald-500/5">
          <CardContent className="pt-6 space-y-5">
            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                Phone Number
              </Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center h-12 px-3 rounded-md border border-input bg-muted text-sm font-semibold text-muted-foreground">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="h-12 text-base flex-1"
                  maxLength={10}
                  autoFocus
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-medium text-red-500 dark:text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Send OTP Button */}
            <Button
              onClick={handleSendOTP}
              disabled={isLoading || !phone}
              className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Send OTP
                </>
              )}
            </Button>

            {/* OR Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium"
              disabled={isGoogleLoading || isWhatsAppLoading || isLoading}
              onClick={handleGoogleLogin}
            >
              {isGoogleLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-5 w-5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full"
                />
              ) : (
                <>
                  <GoogleIcon />
                  <span className="ml-2">Continue with Google</span>
                </>
              )}
            </Button>

            {/* WhatsApp Sign In */}
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
              disabled={isGoogleLoading || isWhatsAppLoading || isLoading}
              onClick={handleWhatsAppLogin}
            >
              {isWhatsAppLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-5 w-5 border-2 border-green-600/30 border-t-green-600 rounded-full"
                />
              ) : (
                <>
                  <MessageCircle className="mr-2 h-5 w-5 text-green-600" />
                  Continue with WhatsApp
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed px-4">
          By continuing, you agree to our{' '}
          <span className="font-medium text-emerald-600 dark:text-emerald-400 underline underline-offset-2 cursor-pointer">
            Terms of Service
          </span>{' '}
          &{' '}
          <span className="font-medium text-emerald-600 dark:text-emerald-400 underline underline-offset-2 cursor-pointer">
            Privacy Policy
          </span>
        </p>
      </motion.div>
    </div>
  );
}
