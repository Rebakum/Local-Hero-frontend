import React, { useCallback, useEffect, useState } from 'react';
import { MessageSquareText, Send, X, Loader2, Bot, User as UserIcon, Headset } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { useSocket } from '../../Context/SocketContext';
import {
  createLiveChatThread,
  getLiveChatThread,
  sendLiveChatMessage,
  requestHumanHandoff,
  type LiveChatMessage,
  type LiveChatStatus,
} from '../../services/api';

const THREAD_KEY = 'localhero-live-chat-thread';

const QUICK_REPLIES = [
  'How do I book a service?',
  'How much does it cost?',
  'Are your pros verified?',
  'I want a human to help me',
];

const makeSessionId = (): string => {
  // crypto.randomUUID is available on modern browsers; fall back to Math.random.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const LiveChatWidget: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(() => localStorage.getItem(THREAD_KEY));
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [status, setStatus] = useState<LiveChatStatus>('AI_ACTIVE');
  const [body, setBody] = useState('');
  const [starting, setStarting] = useState(false);
  const [handingOff, setHandingOff] = useState(false);
  const [thinking, setThinking] = useState(false);

  const applyThread = useCallback((thread: { id: string; status: string; messages: LiveChatMessage[] }) => {
    setThreadId(thread.id);
    setStatus((thread.status as LiveChatStatus) || 'AI_ACTIVE');
    setMessages(thread.messages ?? []);
    localStorage.setItem(THREAD_KEY, thread.id);
  }, []);

  // Load existing thread on mount.
  useEffect(() => {
    if (!threadId) return;
    getLiveChatThread(threadId)
      .then((thread) => {
        setStatus((thread.status as LiveChatStatus) || 'AI_ACTIVE');
        setMessages(thread.messages ?? []);
      })
      .catch(() => {
        localStorage.removeItem(THREAD_KEY);
        setThreadId(null);
      });
  }, [threadId]);

  // Realtime: AI replies, admin replies, and hand-off status changes.
  useEffect(() => {
    if (!socket || !threadId) return;
    socket.emit('live-chat:join', threadId);

    const onMessage = (payload: { threadId: string; message: LiveChatMessage }) => {
      if (payload.threadId !== threadId) return;
      setMessages((current) => (current.some((m) => m.id === payload.message.id) ? current : [...current, payload.message]));
      if (payload.message.senderRole === 'AI') setThinking(false);
    };
    const onHandoff = (payload: { threadId: string; status: string }) => {
      if (payload.threadId === threadId) setStatus((payload.status as LiveChatStatus) || 'PENDING_HUMAN');
    };

    socket.on('live-chat:new', onMessage);
    socket.on('live-chat:handoff', onHandoff);
    return () => {
      socket.off('live-chat:new', onMessage);
      socket.off('live-chat:handoff', onHandoff);
    };
  }, [socket, threadId]);

  const send = async (text?: string) => {
    const content = (text ?? body).trim();
    if (!content || starting) return;
    setStarting(true);
    try {
      if (!threadId) {
        const thread = await createLiveChatThread({
          sessionId: makeSessionId(),
          body: content,
        });
        applyThread(thread);
      } else {
        const message = await sendLiveChatMessage(threadId, content);
        setMessages((current) => (current.some((m) => m.id === message.id) ? current : [...current, message]));
      }
      setBody('');
      // If the thread is still AI-managed, show a subtle "typing" indicator.
      if (status === 'AI_ACTIVE') setThinking(true);
    } finally {
      setStarting(false);
    }
  };

  const requestHuman = async () => {
    if (!threadId || handingOff) return;
    setHandingOff(true);
    try {
      const thread = await requestHumanHandoff(threadId);
      setStatus((thread.status as LiveChatStatus) || 'PENDING_HUMAN');
    } finally {
      setHandingOff(false);
    }
  };

  const isAiMessage = (m: LiveChatMessage) => m.senderRole === 'AI';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open live chat"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/30 transition-transform hover:scale-105"
      >
        <MessageSquareText className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-95">
          <section className="flex h-full min-h-screen flex-col bg-white shadow-2xl dark:bg-navy-900 sm:min-h-0 sm:h-140 sm:rounded-3xl sm:border sm:border-neutral-200 dark:sm:border-white/10">
            <header className="flex items-center justify-between bg-navy-950 px-5 py-4 text-white sm:rounded-t-3xl">
              <div className="flex items-center gap-2">
                {status === 'PENDING_HUMAN' ? <Headset className="h-5 w-5 text-amber-400" /> : <Bot className="h-5 w-5 text-primary" />}
                <div>
                  <p className="font-bold">
                    {status === 'PENDING_HUMAN' ? 'LocalHero Support' : 'LocalHero AI Assistant'}
                  </p>
                  <p className="text-xs text-white/60">
                    {status === 'PENDING_HUMAN' ? 'A team member is on the way' : 'We usually reply instantly'}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close live chat">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="rounded-2xl bg-neutral-100 p-3 text-sm text-navy-800 dark:bg-white/5 dark:text-navy-300">
                  Hi! I&apos;m the LocalHero assistant. Ask me about our services, pricing or how booking works. 👋
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className="flex items-end gap-2">
                  {isAiMessage(message) && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      isAiMessage(message)
                        ? 'bg-neutral-100 text-navy-800 dark:bg-white/10 dark:text-white'
                        : message.senderRole === 'ADMIN'
                          ? 'ml-auto bg-amber-500/15 text-amber-900 ring-1 ring-amber-500/30 dark:text-amber-200'
                          : 'ml-auto bg-red-600 text-white'
                    }`}
                  >
                    {isAiMessage(message) && (
                      <p className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                        <Bot className="h-3 w-3" /> AI Assistant
                      </p>
                    )}
                    {message.senderRole === 'ADMIN' && (
                      <p className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-600">
                        <Headset className="h-3 w-3" /> Support Team
                      </p>
                    )}
                    {message.senderRole === 'USER' && (
                      <p className="mb-0.5 flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-wide text-white/70">
                        <UserIcon className="h-3 w-3" /> You
                      </p>
                    )}
                    {message.body}
                  </div>
                </div>
              ))}

              {thinking && status === 'AI_ACTIVE' && (
                <div className="flex items-end gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="flex items-center gap-1 rounded-2xl bg-neutral-100 px-3 py-2 dark:bg-white/10">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span className="text-xs text-navy-500 dark:text-navy-300">typing…</span>
                  </div>
                </div>
              )}

              {messages.length > 0 && status !== 'PENDING_HUMAN' && status !== 'RESOLVED' && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={requestHuman}
                    disabled={handingOff}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50 dark:bg-amber-500/10 dark:text-amber-300"
                  >
                    {handingOff ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Headset className="h-3.5 w-3.5" />}
                    I want to talk to a human
                  </button>
                </div>
              )}

              {status === 'PENDING_HUMAN' && (
                <div className="rounded-2xl border border-amber-300/40 bg-amber-50 p-3 text-center text-xs font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
                  You&apos;re now connected to our support team — they&apos;ll reply here shortly.
                </div>
              )}
            </div>

            {/* Quick replies */}
            {messages.length === 0 && status === 'AI_ACTIVE' && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    disabled={starting}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-navy-700 transition-colors hover:border-primary hover:text-primary dark:border-white/15 dark:text-navy-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 border-t border-neutral-200 p-4 dark:border-white/10">
              <input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void send();
                }}
                disabled={status === 'PENDING_HUMAN' || status === 'RESOLVED'}
                placeholder={
                  status === 'PENDING_HUMAN'
                    ? 'Waiting for our support team…'
                    : status === 'RESOLVED'
                      ? 'This chat has been closed'
                      : 'Ask me anything…'
                }
                className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={starting || status === 'PENDING_HUMAN' || status === 'RESOLVED'}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white disabled:opacity-50"
              >
                {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};