import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  Settings,
  Server,
  Cpu,
  HardDrive,
  Activity,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  Shield,
  Globe,
  RefreshCw,
  Database,
  Wifi,
  Lock,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'revoked';
  createdAt: string;
  lastUsed: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

const MOCK_API_KEYS: ApiKey[] = [
  { id: '1', name: 'Production API Key', key: 'lh_prod_••••••••••••k8f2', status: 'active', createdAt: '2026-01-15', lastUsed: '2 mins ago' },
  { id: '2', name: 'Staging API Key', key: 'lh_stag_••••••••••••m3j7', status: 'active', createdAt: '2026-03-20', lastUsed: '1 hour ago' },
  { id: '3', name: 'Webhook Key', key: 'lh_whk_••••••••••••p9x1', status: 'active', createdAt: '2026-06-01', lastUsed: '5 mins ago' },
  { id: '4', name: 'Legacy Integration', key: 'lh_leg_••••••••••••q2w4', status: 'revoked', createdAt: '2025-08-10', lastUsed: '3 months ago' },
];

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '14:32:05', level: 'info', message: 'User authentication successful', source: 'auth-service' },
  { id: '2', timestamp: '14:31:42', level: 'warning', message: 'Rate limit approaching for IP 192.168.1.45', source: 'api-gateway' },
  { id: '3', timestamp: '14:30:18', level: 'error', message: 'Payment webhook timeout after 30s', source: 'payment-service' },
  { id: '4', timestamp: '14:29:55', level: 'info', message: 'New provider application received', source: 'user-service' },
  { id: '5', timestamp: '14:28:30', level: 'info', message: 'Database backup completed successfully', source: 'scheduler' },
  { id: '6', timestamp: '14:27:12', level: 'warning', message: 'Email service latency above threshold (2.3s)', source: 'notification-service' },
  { id: '7', timestamp: '14:25:48', level: 'info', message: 'Cache invalidation triggered for /services', source: 'cache-service' },
  { id: '8', timestamp: '14:24:01', level: 'error', message: 'Failed to connect to external mapping API', source: 'geolocation-service' },
];

const SYSTEM_HEALTH = [
  { icon: Server, label: 'API Server', value: 'Operational', status: 'success' as const, bar: '99.99%' },
  { icon: Database, label: 'Database', value: 'Operational', status: 'success' as const, bar: '99.98%' },
  { icon: Wifi, label: 'CDN', value: 'Operational', status: 'success' as const, bar: '100%' },
  { icon: Lock, label: 'Auth Service', value: 'Operational', status: 'success' as const, bar: '99.97%' },
  { icon: Globe, label: 'Payment Gateway', value: 'Degraded', status: 'warning' as const, bar: '98.5%' },
];

const LOG_LEVEL_CONFIG: Record<string, { color: string; badge: 'success' | 'warning' | 'emergency' }> = {
  info: { color: 'text-emerald-500', badge: 'success' },
  warning: { color: 'text-amber-500', badge: 'warning' },
  error: { color: 'text-red-500', badge: 'emergency' },
};

const SystemPage: React.FC = () => {
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => (prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]));
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 p-6 sm:p-8 text-white shadow-xl shadow-rose-500/20"
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute left-1/3 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">System Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Platform Control</h1>
            <p className="mt-2 text-sm text-white/70 max-w-md leading-relaxed">
              Manage API keys, monitor system health, and review audit logs.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
            <Activity className="w-4 h-4 text-emerald-300" />
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">System Health</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {SYSTEM_HEALTH.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                className="p-3 rounded-xl bg-cream-50 dark:bg-navy-800/50 border border-navy-100 dark:border-white/5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4 text-navy-500 dark:text-navy-400" />
                  <span className="text-xs font-semibold text-navy-600 dark:text-navy-300">{item.label}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={item.status}>{item.value}</Badge>
                  <span className="text-[10px] font-bold text-navy-400">{item.bar}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-navy-100 dark:bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.bar }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${item.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card padding="sm" className="overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Key className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white">API Keys</h2>
                  <p className="text-xs text-navy-400 dark:text-navy-500">Manage platform API credentials</p>
                </div>
              </div>
              <Badge variant="primary">{MOCK_API_KEYS.filter((k) => k.status === 'active').length} Active</Badge>
            </div>
            <div className="divide-y divide-navy-50 dark:divide-white/5">
              {MOCK_API_KEYS.map((apiKey, i) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                  className="px-6 py-4 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-navy-800 dark:text-navy-200">{apiKey.name}</h3>
                      <Badge variant={apiKey.status === 'active' ? 'success' : 'neutral'}>{apiKey.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-1.5 rounded-lg bg-navy-100 dark:bg-white/5 text-xs font-mono text-navy-600 dark:text-navy-400">
                      {visibleKeys.includes(apiKey.id) ? apiKey.key.replace(/•/g, 'a') : apiKey.key}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="w-8 h-8 rounded-lg bg-navy-100 dark:bg-white/5 flex items-center justify-center text-navy-500 hover:bg-navy-200 dark:hover:bg-white/10 transition-colors"
                    >
                      {visibleKeys.includes(apiKey.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => copyKey(apiKey.id, apiKey.key)}
                      className="w-8 h-8 rounded-lg bg-navy-100 dark:bg-white/5 flex items-center justify-center text-navy-500 hover:bg-navy-200 dark:hover:bg-white/10 transition-colors"
                    >
                      {copiedId === apiKey.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-navy-400 dark:text-navy-500 mt-2">
                    Created {apiKey.createdAt} · Last used {apiKey.lastUsed}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Audit Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card padding="sm" className="overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white">Audit Logs</h2>
                  <p className="text-xs text-navy-400 dark:text-navy-500">Recent system activity</p>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-xs font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
            <div className="divide-y divide-navy-50 dark:divide-white/5 max-h-[480px] overflow-y-auto">
              {MOCK_LOGS.map((log, i) => {
                const config = LOG_LEVEL_CONFIG[log.level];
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
                    className="px-6 py-3 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                        <Badge variant={config.badge} className="text-[9px] py-0 px-1.5">
                          {log.level.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-navy-800 dark:text-navy-200">{log.message}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-navy-400 dark:text-navy-500">
                          <Clock className="w-3 h-3" />
                          {log.timestamp}
                          <span className="text-navy-300 dark:text-navy-600">·</span>
                          <span className="font-mono">{log.source}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Platform Config */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Platform Settings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Maintenance Mode', value: 'Off', status: 'success', description: 'Platform is live and accessible' },
              { label: 'Registration', value: 'Open', status: 'success', description: 'New users can register freely' },
              { label: 'Auto-Approve Providers', value: 'Disabled', status: 'warning', description: 'Manual review required for all applications' },
              { label: 'Email Notifications', value: 'Active', status: 'success', description: 'All email services operational' },
              { label: 'Payment Processing', value: 'Active', status: 'warning', description: 'Minor delays reported with Stripe webhook' },
              { label: 'Rate Limiting', value: '100 req/min', status: 'success', description: 'Per-user API rate limit enforced' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.06, duration: 0.4 }}
                className="p-4 rounded-xl bg-cream-50 dark:bg-navy-800/50 border border-navy-100 dark:border-white/5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-navy-700 dark:text-navy-300">{item.label}</span>
                  <Badge variant={item.status as 'success' | 'warning'}>{item.value}</Badge>
                </div>
                <p className="text-[11px] text-navy-400 dark:text-navy-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SystemPage;
