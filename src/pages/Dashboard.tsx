import { useState } from 'react';
import { BarChart3, DollarSign, Eye, MousePointerClick, Plus, Filter, CreditCard, FileText, ChevronRight, TrendingUp, Users, Clock } from 'lucide-react';
import DesktopSidebar from '@/components/DesktopSidebar';
import BottomNav from '@/components/BottomNav';
import { motion } from 'framer-motion';

type Tab = 'overview' | 'ads' | 'billing';

interface Ad {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'ended';
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

const mockAds: Ad[] = [
  { id: '1', name: 'Summer Sale Campaign', status: 'active', spent: 245.50, impressions: 15200, clicks: 432, ctr: 2.84 },
  { id: '2', name: 'New Product Launch', status: 'active', spent: 189.00, impressions: 8900, clicks: 267, ctr: 3.0 },
  { id: '3', name: 'Brand Awareness Q1', status: 'ended', spent: 500.00, impressions: 42000, clicks: 1260, ctr: 3.0 },
  { id: '4', name: 'Holiday Special', status: 'paused', spent: 78.25, impressions: 3400, clicks: 102, ctr: 3.0 },
];

const payments = [
  { id: 'p1', date: '2026-03-15', amount: 245.50, method: '•••• 4242', status: 'paid' },
  { id: 'p2', date: '2026-02-15', amount: 189.00, method: '•••• 4242', status: 'paid' },
  { id: 'p3', date: '2026-01-15', amount: 500.00, method: '•••• 1234', status: 'paid' },
];

const StatCard = ({ icon: Icon, label, value, change }: { icon: any; label: string; value: string; change: string }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <Icon size={16} className="text-muted-foreground" />
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-emerald-500 font-medium flex items-center gap-1"><TrendingUp size={12} />{change}</p>
  </motion.div>
);

const Dashboard = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [adFilter, setAdFilter] = useState<'all' | 'active' | 'paused' | 'ended'>('all');

  const filteredAds = adFilter === 'all' ? mockAds : mockAds.filter(a => a.status === adFilter);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'ads', label: 'Manage Ads' },
    { key: 'billing', label: 'Billing & Payment' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="md:ml-[72px] xl:ml-[245px]">
        <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl px-4 py-3">
          <h1 className="font-display text-lg font-bold">Dashboard</h1>
        </header>

        {/* Tabs */}
        <div className="border-b border-border px-4">
          <div className="flex gap-6 max-w-4xl mx-auto">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-accent text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 pb-20 md:pb-8">
          {/* Overview */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon={Eye} label="Total Impressions" value="69.5K" change="+12.5% from last month" />
                <StatCard icon={MousePointerClick} label="Total Clicks" value="2,061" change="+8.2% from last month" />
                <StatCard icon={DollarSign} label="Total Spent" value="$1,012.75" change="+5.1% from last month" />
                <StatCard icon={Users} label="Reach" value="45.2K" change="+18.3% from last month" />
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-4">Performance Overview</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const h = [40, 65, 55, 80, 72, 90, 60][i];
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05 }} className="w-full bg-accent/80 rounded-t-md" />
                        <span className="text-[10px] text-muted-foreground">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { text: 'Summer Sale Campaign received 432 clicks', time: '2h ago' },
                    { text: 'New Product Launch ad approved', time: '5h ago' },
                    { text: 'Payment of $245.50 processed', time: '1d ago' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <p className="text-sm">{a.text}</p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} />{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ads */}
          {tab === 'ads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-muted-foreground" />
                  {(['all', 'active', 'paused', 'ended'] as const).map(f => (
                    <button key={f} onClick={() => setAdFilter(f)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${adFilter === f ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors">
                  <Plus size={16} /> Create your next ad
                </button>
              </div>

              {filteredAds.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <BarChart3 size={48} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-medium">
                    {adFilter === 'all' ? 'No ads available.' : 'There are no ads matching the selected filters.'}
                  </p>
                  <button className="mt-4 rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground">
                    Create your next ad
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAds.map(ad => (
                    <div key={ad.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{ad.name}</h4>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${ad.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : ad.status === 'paused' ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                            {ad.status}
                          </span>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>${ad.spent.toFixed(2)} spent</span>
                          <span>{ad.impressions.toLocaleString()} impressions</span>
                          <span>{ad.clicks} clicks</span>
                          <span>{ad.ctr}% CTR</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Billing */}
          {tab === 'billing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard size={18} /> Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-12 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                        <div>
                          <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 08/28</p>
                        </div>
                      </div>
                      <span className="text-xs text-accent font-medium">Default</span>
                    </div>
                    <button className="w-full rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-accent hover:text-accent transition-colors">
                      + Add payment method
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-4">Current Plan</h3>
                  <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
                    <p className="text-lg font-bold">Pro Plan</p>
                    <p className="text-2xl font-bold mt-1">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <li>✓ Unlimited ads</li>
                      <li>✓ Advanced analytics</li>
                      <li>✓ Priority support</li>
                    </ul>
                    <button className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground w-full">Manage Plan</button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText size={18} /> Payment History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-3 font-medium">Date</th>
                        <th className="text-left py-3 font-medium">Amount</th>
                        <th className="text-left py-3 font-medium">Method</th>
                        <th className="text-left py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} className="border-b border-border last:border-0">
                          <td className="py-3">{p.date}</td>
                          <td className="py-3 font-medium">${p.amount.toFixed(2)}</td>
                          <td className="py-3 text-muted-foreground">{p.method}</td>
                          <td className="py-3"><span className="rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-xs font-medium capitalize">{p.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
