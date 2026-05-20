'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  Send,
  Camera,
  Mic,
  MoreVertical,
  Trash2,
  Download,
  X,
  FileText,
  Pill,
  Apple,
  Dumbbell,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChatStore, useQuizStore, useAppStore } from '@/lib/store';
import type { ChatMessage } from '@/lib/types';

// ─── Constants ────────────────────────────────────────────────
const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm your Medpac AI Health Assistant. I can help you understand your health reports, suggest lifestyle changes, answer medicine queries, and much more. How can I help you today?",
  timestamp: new Date().toISOString(),
};

const SUGGESTION_CHIPS = [
  { label: 'Analyze my report', icon: FileText },
  { label: 'Medicine info', icon: Pill },
  { label: 'Diet advice', icon: Apple },
  { label: 'Exercise tips', icon: Dumbbell },
  { label: 'Check symptoms', icon: Stethoscope },
  { label: 'Mental health', icon: HeartPulse },
];

// ─── Typing Indicator ─────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <Avatar className="h-8 w-8 shrink-0 border border-border">
        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
          <Brain className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-white dark:bg-gray-800 border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="inline-block h-2 w-2 rounded-full bg-teal-500"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Options Dropdown ─────────────────────────────────────────
function OptionsDropdown({
  onClearChat,
  onExportChat,
  isOpen,
  onToggle,
}: {
  onClearChat: () => void;
  onExportChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onToggle();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
        aria-label="Options menu"
      >
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg border border-border bg-popover shadow-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => {
                onClearChat();
                onToggle();
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              Clear Chat
            </button>
            <button
              type="button"
              onClick={() => {
                onExportChat();
                onToggle();
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              Export Chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Chat Message Bubble ──────────────────────────────────────
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0 border border-border/40">
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary-container text-white">
            <Brain className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[78%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm
          ${
            isUser
              ? 'bg-primary text-white rounded-br-md'
              : 'bg-surface-container-high border border-border/40 text-on-surface rounded-bl-md'
          }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span
          className={`block mt-1 text-[10px] ${
            isUser ? 'text-white/80' : 'text-muted-foreground'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main AI Assistant Screen ─────────────────────────────────
export default function AIAssistantScreen() {
  const { goBack, setScreen } = useAppStore();
  const { messages, addMessage, clearChat, isLoading, setLoading } = useChatStore();
  const { quizData, quizCompleted } = useQuizStore();

  const [inputText, setInputText] = useState('');
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derived: all messages including welcome
  const allMessages = messages.length === 0 ? [WELCOME_MESSAGE] : messages;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ─── Personalized greeting ──────────────────────────────────
  const getPersonalizedGreeting = useCallback((): string => {
    if (!quizCompleted || !quizData) return '';
    const parts: string[] = [];
    if (quizData.age) parts.push(`age ${quizData.age}`);
    if (quizData.gender) parts.push(quizData.gender);
    if (quizData.existingConditions?.length && !quizData.existingConditions.includes('None')) {
      parts.push(`conditions: ${quizData.existingConditions.join(', ')}`);
    }
    if (quizData.healthGoals?.length) {
      parts.push(`goals: ${quizData.healthGoals.join(', ')}`);
    }
    return parts.length > 0 ? `User profile — ${parts.join('; ')}` : '';
  }, [quizCompleted, quizData]);

  // ─── Send message ───────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      setInputText('');

      // Add user message
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMsg);

      // Build messages array for API (include previous + new user msg)
      const apiMessages = [...messages, userMsg]
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content }));

      // Add system message with personalization context
      const systemContent = [
        'You are Medpac AI Health Assistant, a helpful, empathetic, and knowledgeable healthcare assistant for Indian families. Provide accurate health information, lifestyle suggestions, medicine guidance, and help interpret health reports. Always include a disclaimer that you are not a substitute for professional medical advice. Respond in a friendly, culturally appropriate manner for Indian users.',
        getPersonalizedGreeting(),
      ]
        .filter(Boolean)
        .join('\n\n');

      apiMessages.unshift({ role: 'system', content: systemContent });

      setLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            quizData: quizCompleted ? quizData : null,
          }),
        });

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        // Check if the response is a stream or JSON
        const contentType = response.headers.get('content-type') || '';
        let aiContent = '';

        if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
          // Streaming response
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) throw new Error('No readable stream');

          // Add a placeholder AI message for streaming
          const aiMsgId = `ai-${Date.now()}`;
          const aiMsg: ChatMessage = {
            id: aiMsgId,
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            isTyping: true,
          };
          addMessage(aiMsg);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            aiContent += chunk;
            useChatStore.getState().updateLastMessage(aiContent);
          }

          // Finalize
          useChatStore.getState().updateLastMessage(aiContent);
        } else {
          // JSON response
          const data = await response.json();
          aiContent = data.content || data.message || data.reply || 'I apologize, I could not process that request.';

          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: aiContent,
            timestamp: new Date().toISOString(),
          };
          addMessage(aiMsg);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setError(errorMessage);

        // Add error as AI message so user sees it inline
        const errMsg: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: `I'm sorry, I encountered an issue: ${errorMessage}. Please try again or rephrase your question.`,
          timestamp: new Date().toISOString(),
        };
        addMessage(errMsg);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [isLoading, messages, addMessage, setLoading, getPersonalizedGreeting, quizCompleted, quizData]
  );

  // ─── Handle form submit ─────────────────────────────────────
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(inputText);
    },
    [inputText, sendMessage]
  );

  // ─── Handle chip press ──────────────────────────────────────
  const handleChipPress = useCallback(
    (label: string) => {
      sendMessage(label);
    },
    [sendMessage]
  );

  // ─── Clear chat ─────────────────────────────────────────────
  const handleClearChat = useCallback(() => {
    clearChat();
    setError(null);
  }, [clearChat]);

  // ─── Export chat ─────────────────────────────────────────────
  const handleExportChat = useCallback(() => {
    const exportText = allMessages
      .map((m) => {
        const sender = m.role === 'user' ? 'You' : 'Medpac AI';
        const time = new Date(m.timestamp).toLocaleString();
        return `[${time}] ${sender}: ${m.content}`;
      })
      .join('\n\n');

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medpac-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [allMessages]);

  // ─── Navigate to report analyzer ────────────────────────────
  const handleCameraPress = useCallback(() => {
    setScreen('report-analyzer');
  }, [setScreen]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md antialiased">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white dark:bg-card border-b border-border/40">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted text-on-surface-variant transition-colors cursor-pointer active:scale-95 transition-transform"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-container shadow-sm">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground leading-tight">
                  AI Health Assistant
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-[11px] font-medium text-green-600 dark:text-green-400">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          <OptionsDropdown
            isOpen={optionsOpen}
            onToggle={() => setOptionsOpen((prev) => !prev)}
            onClearChat={handleClearChat}
            onExportChat={handleExportChat}
          />
        </div>
      </header>

      {/* ─── Personalization Banner ─────────────────────────────── */}
      {quizCompleted && quizData && messages.length === 0 && (
        <div className="max-w-2xl mx-auto w-full px-4 pt-3">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20 bg-primary-container/10 shadow-none rounded-2xl">
              <CardContent className="p-3.5 flex items-center gap-2.5">
                <Avatar className="h-7 w-7 shrink-0 border border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    P
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-on-primary-container leading-snug font-medium">
                  Personalized for you — {quizData.healthGoals?.slice(0, 2).join(', ')}
                  {quizData.existingConditions?.length &&
                  !quizData.existingConditions.includes('None')
                    ? ` • Managing ${quizData.existingConditions[0]}`
                    : ''}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* ─── Chat Messages Area ─────────────────────────────────── */}
      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.15) transparent',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <AnimatePresence initial={false}>
            {allMessages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* Error display */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Card className="border-destructive/20 bg-destructive/10 shadow-none rounded-2xl">
                <CardContent className="p-3 flex items-center gap-2">
                  <span className="text-destructive text-sm">&#9888;</span>
                  <p className="text-xs text-destructive">{error}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ─── Quick Suggestion Chips ─────────────────────────────── */}
      <div className="border-t border-border/40 bg-white/80 dark:bg-card/85 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {SUGGESTION_CHIPS.map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleChipPress(chip.label)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-card hover:bg-primary-container/20 text-xs font-semibold text-on-surface whitespace-nowrap shadow-sm hover:border-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer active:scale-95"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Input Area ─────────────────────────────────────────── */}
      <footer className="sticky bottom-0 bg-white/90 dark:bg-card/90 backdrop-blur-md border-t border-border/40">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {/* Camera / Attach button */}
            <button
              type="button"
              onClick={handleCameraPress}
              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted text-on-surface-variant transition-colors shrink-0 cursor-pointer active:scale-95"
              aria-label="Upload report"
              title="Upload report"
            >
              <Camera className="h-5 w-5" />
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything about your health..."
                disabled={isLoading}
                className="h-11 pr-3 text-sm rounded-full border-border/50 bg-surface-container-high focus:bg-white dark:focus:bg-card text-on-surface transition-colors"
                autoFocus
              />
            </div>

            {/* Mic button (decorative placeholder) */}
            <button
              type="button"
              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted text-on-surface-variant transition-colors shrink-0 cursor-pointer active:scale-95"
              aria-label="Voice input (coming soon)"
              title="Voice input"
            >
              <Mic className="h-5 w-5" />
            </button>

            {/* Send button */}
            <Button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white shrink-0 shadow-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
