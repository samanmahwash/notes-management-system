import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText, FiStar, FiArchive, FiPlus } from 'react-icons/fi';
import { RiPushpinFill } from 'react-icons/ri';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { fetchDashboardStats } from '../services/noteService';
import { stripHtml, formatRelative } from '../utils/helpers';

const PIE_COLORS = ['#C89B3C', '#6B8F71', '#5A7D9A', '#B5563C', '#8B6BAE', '#3E7C6B'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchDashboardStats();
        setData(result);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />;
  }

  const { stats, byCategory, monthlyNotes, recentNotes, pinnedNotes } = data || {};

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-graphite">A quick look at how your notes are shaping up.</p>
        </div>
        <Link to="/notes?new=1" className="btn-primary">
          <FiPlus size={16} /> New note
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FiFileText} label="Total Notes" value={stats?.totalNotes ?? 0} accent="text-gold-dark dark:text-gold" />
        <StatCard icon={FiStar} label="Favorites" value={stats?.favoriteNotes ?? 0} accent="text-pine" />
        <StatCard icon={FiArchive} label="Archived" value={stats?.archivedNotes ?? 0} accent="text-clay" />
        <StatCard icon={RiPushpinFill} label="Pinned" value={stats?.pinnedNotes ?? 0} accent="text-gold-dark dark:text-gold" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-display text-base font-medium">Notes by Category</h3>
          {byCategory?.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={byCategory} dataKey="count" nameKey="category" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {byCategory.map((entry, index) => (
                    <Cell key={entry.category} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-graphite">Assign categories to notes to see this chart.</p>
          )}
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-display text-base font-medium">Monthly Notes Created</h3>
          {monthlyNotes?.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyNotes}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 13 }} />
                <Bar dataKey="count" fill="#C89B3C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-graphite">Create a few notes to see your trend.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-display text-base font-medium">Pinned Notes</h3>
          {pinnedNotes?.length ? (
            <div className="space-y-3">
              {pinnedNotes.map((n) => (
                <Link
                  key={n._id}
                  to="/notes"
                  className="block rounded-xl border border-ink/5 dark:border-paper/10 p-3 transition-colors hover:bg-ink/5 dark:hover:bg-paper/10"
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="line-clamp-1 text-xs text-graphite">{stripHtml(n.content)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="Nothing pinned yet" description="Pin your most important notes to find them faster." />
          )}
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-display text-base font-medium">Recent Activity</h3>
          {recentNotes?.length ? (
            <div className="space-y-3">
              {recentNotes.map((n) => (
                <motion.div key={n._id} className="flex items-center justify-between border-b border-ink/5 dark:border-paper/10 pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-xs text-graphite">Updated {formatRelative(n.updatedAt)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState title="No activity yet" description="Your recent note edits will show up here." />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
