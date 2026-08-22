import React, { useCallback, useEffect, useState } from 'react';
import { MessageSquareText, Send, Loader2, Bot, Headset, CheckCircle2, RotateCcw } from 'lucide-react';
import { useSocket } from '../../../../Context/SocketContext';
import {
  getLiveChatThreads,
  sendLiveChatMessage,
  resolveLiveChatThread,
  reactivateLiveChatAi,
  type LiveChatThread,
} from '../../../../services/api';

const STATUS_META: Record<string, { label: string; cls: string }> = {
  AI_ACTIVE: { label: 'AI Active', cls: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30' },
  PENDING_HUMAN: { label: 'Needs Human', cls: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30' },
  RESOLVED: { label: 'Resolved', cls: 'bg-navy-100 text-navy-600 border-navy-200 dark:bg-white/10 dark:text-navy-300 dark:border-white/15' },
};

const bubbleFor = (role: string, body: string) => {
  const base = 'max-w-[75%] rounded-2xl px-3 py-2 text-sm ';
  if (role === 'ADMIN') return { cls: base + 'ml-auto bg-amber-500/15 text-amber-900 ring-1 ring-amber-500/30 dark:text-amber-200', label: 'Support Team', icon: 'admin' };
  if (role === 'AI') return { cls: base + 'bg-neutral-100 text-navy-800 dark:bg-white/10 dark:text-white', label: 'AI Assistant', icon: 'ai' };
  return { cls: base + 'ml-auto bg-red-600 text-white', label: null, icon: null };
};

const LiveChatManagement: React.FC = () => {
  const { socket } = useSocket();
  const [threads, setThreads] = useState<LiveChatThread[]>([]);
  const [selected, setSelected] = useState<LiveChatThread | null>(null);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getLiveChatThreads();
      setThreads(data);
      setSelected((current) => {
        if (!current) return data[0] ?? null;
        const fresh = data.find((t) => t.id === current.id);
        return fresh ?? data[0] ?? null;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 15000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => void load();
    socket.on('live-chat:new', refresh);
    socket.on('live-chat:handoff', refresh);
    return () => {
      socket.off('live-chat:new', refresh);
      socket.off('live-chat:handoff', refresh);
    };
  }, [socket, load]);

  const send = async () => {
    if (!selected || !body.trim()) return;
    setBusy(true);
    try {
      await sendLiveChatMessage(selected.id, body);
      setBody('');
      await load();
    } finally {
      setBusy(false);
    }
  };

  const resolve = async () => {
    if (!selected) return;
    await resolveLiveChatThread(selected.id);
    await load();
  };

  const reactivate = async () => {
    if (!selected) return;
    await reactivateLiveChatAi(selected.id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-red-600">Admin Panel</p>
        <h1 className="mt-2 text-2xl font-black text-navy-950 dark:text-white">Live Chat</h1>
        <p className="mt-1 text-sm text-navy-800 dark:text-navy-300">Monitor and reply to AI-assisted support conversations in real time.</p>
      </div>

      <div className="grid min-h-140 gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-neutral-200 bg-white p-2 dark:border-white/10 dark:bg-navy-900">
          {loading ? (
            <Loader2 className="mx-auto mt-8 animate-spin text-red-600" />
          ) : threads.length === 0 ? (
            <p className="p-4 text-sm text-navy-800 dark:text-navy-300">No chat threads yet.</p>
          ) : (
            threads.map((thread) => {
              const meta = STATUS_META[thread.status] ?? STATUS_META.AI_ACTIVE;
              const label = thread.guestName || thread.guestEmail || thread.userId || 'Visitor';
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setSelected(thread)}
                  className={`w-full rounded-xl p-3 text-left ${selected?.id === thread.id ? 'bg-red-50 dark:bg-red-500/10' : 'hover:bg-neutral-50 dark:hover:bg-white/5'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold text-navy-900 dark:text-white">{label}</p>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.cls}`}>{meta.label}</span>
                  </div>
                  <p className="truncate text-xs text-navy-800 dark:text-navy-300">{thread.messages.at(-1)?.body || 'No messages'}</p>
                </button>
              );
            })
          )}
        </aside>

        <section className="flex flex-col rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-navy-900">
          {selected ? (
            <>
              <header className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-white/10">
                <div>
                  <p className="font-bold text-navy-950 dark:text-white">
                    {selected.guestName || selected.guestEmail || selected.userId || 'Visitor'}
                  </p>
                  <p className="text-xs text-navy-800 dark:text-navy-300">
                    {selected.messages.length} message{selected.messages.length === 1 ? '' : 's'} · {selected.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selected.status === 'PENDING_HUMAN' && (
                    <button type="button" onClick={reactivate} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-primary hover:text-primary dark:border-white/15 dark:text-navy-200">
                      <RotateCcw className="h-3.5 w-3.5" /> Re-activate AI
                    </button>
                  )}
                  {selected.status !== 'RESOLVED' && (
                    <button type="button" onClick={resolve} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                    </button>
                  )}
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {selected.messages.map((message) => {
                  const b = bubbleFor(message.senderRole, message.body);
                  return (
                    <div key={message.id} className="flex items-end gap-2">
                      {b.icon === 'ai' && (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Bot className="h-4 w-4" />
                        </span>
                      )}
                      {b.icon === 'admin' && (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                          <Headset className="h-4 w-4" />
                        </span>
                      )}
                      <div className={b.cls}>
                        {b.label && (
                          <p className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary">{b.label}</p>
                        )}
                        {message.body}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 border-t border-neutral-200 p-4 dark:border-white/10">
                <input
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void send();
                  }}
                  placeholder="Reply to customer..."
                  className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <button type="button" onClick={() => void send()} disabled={busy} aria-label="Send reply" className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-navy-400">
              <MessageSquareText className="mb-2 h-8 w-8" />
              <p className="dark:text-navy-300">Select a conversation</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LiveChatManagement;