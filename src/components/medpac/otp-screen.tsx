'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { User } from '@/lib/types';
import { useAppStore, useAuthStore } from '@/lib/store';

// ─── Constants ────────────────────────────────────────────────
const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 30;

// Helper to read phone from sessionStorage synchronously
function getStoredPhone(): string {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('medpac_phone') || '';
  }
  return '';
}

export default function OTPScreen() {
  const { setScreen } = useAppStore();
  const { login } = useAuthStore();

  // OTP state — initialize phone lazily from sessionStorage
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [resendTriggered, setResendTriggered] = useState(false);
  const phone = getStoredPhone();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mask the phone number for display
  const maskedPhone = phone
    ? `+91 ${phone.slice(0, 2)}****${phone.slice(-2)}`
    : '+91 XXXXXXXXXX';

  // Derived: can resend when countdown reaches 0
  const canResend = countdown <= 0;

  // ─── Countdown timer ────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, resendTriggered]);

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ─── Verify ─────────────────────────────────────────────────
  const handleVerify = useCallback(() => {
    const currentOtp = otp;
    const otpValue = currentOtp.join('');

    if (otpValue.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate verification (any 6-digit code works for demo)
    verifyTimerRef.current = setTimeout(() => {
      const user: User = {
        id: 'user_1',
        name: '',
        phone,
        createdAt: new Date().toISOString(),
      };
      login(user);
      setScreen('home');
      setIsVerifying(false);
    }, 1000);
  }, [otp, phone, login, setScreen]);

  // Cleanup verify timer on unmount
  useEffect(() => {
    return () => {
      if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
    };
  }, []);

  // ─── OTP input handling ─────────────────────────────────────
  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only allow single digit
      const digit = value.replace(/\D/g, '').slice(-1);

      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);
      setError('');

      // Auto-focus next input
      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-verify when all digits filled
      const allFilled = newOtp.every((d) => d !== '');
      if (allFilled && digit) {
        // Use a micro-delay to let state settle before verifying
        setTimeout(() => {
          const otpValue = newOtp.join('');
          if (otpValue.length === OTP_LENGTH) {
            setIsVerifying(true);
            setError('');
            setTimeout(() => {
              const user: User = {
                id: 'user_1',
                name: '',
                phone,
                createdAt: new Date().toISOString(),
              };
              login(user);
              setScreen('home');
              setIsVerifying(false);
            }, 1000);
          }
        }, 100);
      }
    },
    [otp, phone, login, setScreen]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
          setOtp((prev) => {
            const newOtp = [...prev];
            newOtp[index - 1] = '';
            return newOtp;
          });
        } else {
          setOtp((prev) => {
            const newOtp = [...prev];
            newOtp[index] = '';
            return newOtp;
          });
        }
        setError('');
      }

      if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length > 0) {
      const newOtp = [...Array(OTP_LENGTH).fill('')];
      pasted.split('').forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      setError('');
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  }, []);

  // ─── Resend ─────────────────────────────────────────────────
  const handleResend = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    setResendTriggered((prev) => !prev);
    setCountdown(COUNTDOWN_SECONDS);
    inputRefs.current[0]?.focus();
  }, []);

  const isOtpComplete = otp.every((d) => d !== '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 dark:from-gray-950 dark:to-emerald-950/10 flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Back button */}
        <button
          type="button"
          onClick={() => setScreen('login')}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          aria-label="Go back to login"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
        </motion.div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Verify Your Number
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            We&apos;ve sent a 6-digit code to{' '}
            <span className="font-semibold text-foreground">{maskedPhone}</span>
          </p>
        </div>

        {/* OTP Card */}
        <Card className="border-border/50 shadow-lg shadow-emerald-500/5">
          <CardContent className="pt-6 space-y-6">
            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-bold p-0 
                    ${digit ? 'border-emerald-500 ring-1 ring-emerald-500/30' : ''}
                    ${error ? 'border-red-400 ring-1 ring-red-400/30' : ''}
                    focus:border-emerald-500 focus:ring-emerald-500/30
                  `}
                  aria-label={`OTP digit ${index + 1}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-red-500 dark:text-red-400 text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={!isOtpComplete || isVerifying}
              className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
            >
              {isVerifying ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                'Verify & Continue'
              )}
            </Button>

            {/* Resend */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in{' '}
                  <span className="font-semibold text-foreground tabular-nums">
                    {formatCountdown(countdown)}
                  </span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
