import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Loader2,
  AlertCircle,
  Send,
  ChevronLeft,
  Search,
} from 'lucide-react';
import { PageHeader } from '../ui';
import { useAuth } from '../../Context/AuthContext';
import { useSocket } from '../../Context/SocketContext';
import {
  getMyConversations,
  getConversation,
  sendMessage,
  markConversationRead,
  type Conversation,
  type Message,
} from '../../services/messaging.service';

interface MessagesManagerProps {
  eyebrow: string;
  title: string;
  description: string;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

export const MessagesManager: React.FC<MessagesManagerProps> = ({
  eyebrow,
  title,
  description,
}) => {
  const { user } = useAuth();
  const myId = user?.id;
  const location = useLocation();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeId, setActiveId] = useState<string | null>(null);
  const [active, setActive] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const threadRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyConversations();
      setConversations(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load conversations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openConversation = async (id: string) => {
    setActiveId(id);
    setThreadLoading(true);
    setError(null);
    try {
      const conversation = await getConversation(id);
      setActive(conversation);
      setMessages(conversation.messages ?? []);
      void markConversationRead(id);
      void loadConversations();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not open conversation.');
    } finally {
      setThreadLoading(false);
    }
  };

  // Auto-open a conversation passed in via navigation state (e.g. when the
  // user clicks "Message" on a professional's profile page).
  useEffect(() => {
    const conversationId = (location.state as { conversationId?: string } | null)?.conversationId;
    if (conversationId) {
      void openConversation(conversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Real-time: append new messages and refresh the conversation list.
  useEffect(() => {
    if (!socket) return;
    const onMessage = (payload: { conversationId?: string; message?: Message }) => {
      if (payload?.message && payload.conversationId === activeId) {
        setMessages((prev) =>
          prev.some((m) => m.id === payload.message!.id) ? prev : [...prev, payload.message!]
        );
      }
      void loadConversations();
    };
    socket.on('message:new', onMessage);
    return () => {
      socket.off('message:new', onMessage);
    };
  }, [socket, activeId, loadConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const body = input.trim();
    if (!activeId || !body) return;
    setSending(true);
    setError(null);
    try {
      const message = await sendMessage(activeId, { body });
      setMessages((prev) => [...prev, message]);
      setInput('');
      void loadConversations();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  const participantName = (c: Conversation) => {
    if (c.professional) return c.professional.companyName || c.professional.name;
    return c.customer?.name ?? 'Customer';
  };

  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      participantName(c).toLowerCase().includes(q) ||
      lastMessagePreview(c).toLowerCase().includes(q)
    );
  });

  const lastMessagePreview = (c: Conversation) => {
    const last = c.messages?.[0];
    if (!last) return 'No messages yet';
    return last.body || '📷 Photo';
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-navy-900 border border-neutral-200 dark:border-white/10 rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-[560px]">
          {/* Conversation list */}
          <div
            className={`w-full md:w-80 shrink-0 border-r border-navy-100 dark:border-white/10 flex flex-col ${
              activeId ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="p-4 border-b border-navy-100 dark:border-white/10 space-y-2">
              <p className="text-sm font-bold text-navy-800 dark:text-white">
                Conversations
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-navy-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="input-lh pl-9 h-9 text-xs"
                />
              </div>
              <p className="text-xs text-navy-400 dark:text-navy-500">
                {filteredConversations.length} total
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="py-12 text-center px-6">
                  <MessageSquare className="w-10 h-10 text-navy-300 dark:text-navy-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-navy-500 dark:text-navy-300">
                    {conversations.length === 0 ? 'No conversations yet' : 'No matches found'}
                  </p>
                  <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">
                    Messages will appear here once a customer and business start chatting.
                  </p>
                </div>
              ) : (
                filteredConversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => openConversation(c.id)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      activeId === c.id
                        ? 'bg-primary/5 border-l-2 border-primary'
                        : 'hover:bg-navy-50 dark:hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {participantName(c).slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-navy-800 dark:text-white truncate">
                          {participantName(c)}
                        </p>
                        <span className="text-[10px] text-navy-400 dark:text-navy-500 shrink-0">
                          {formatTime(c.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-xs text-navy-400 dark:text-navy-500 truncate mt-0.5">
                        {lastMessagePreview(c)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Thread */}
          <div className={`flex-1 flex flex-col min-w-0 ${activeId ? 'flex' : 'hidden md:flex'}`}>
            {!activeId ? (
              <div className="flex-1 flex items-center justify-center text-navy-300 dark:text-navy-600">
                <div className="text-center px-6">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Select a conversation</p>
                </div>
              </div>
            ) : threadLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-navy-100 dark:border-white/10 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveId(null);
                      setActive(null);
                      setMessages([]);
                    }}
                    className="md:hidden p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <p className="font-semibold text-navy-800 dark:text-white truncate">
                    {active ? participantName(active) : ''}
                  </p>
                </div>

                <div ref={threadRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => {
                    const mine = message.senderId === myId;
                    return (
                      <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                            mine
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-navy-100 dark:bg-white/10 text-navy-800 dark:text-navy-200 rounded-bl-sm'
                          }`}
                        >
                          {message.body && <p>{message.body}</p>}
                          {message.image && (
                            <img
                              src={message.image}
                              alt="attachment"
                              className="rounded-xl mt-1 max-w-[240px]"
                            />
                          )}
                          <p
                            className={`text-[10px] mt-1 ${
                              mine ? 'text-white/70' : 'text-navy-400 dark:text-navy-500'
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 border-t border-navy-100 dark:border-white/10 flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    className="input-lh flex-1"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !input.trim()}
                    className="w-10 h-10 shrink-0 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesManager;
