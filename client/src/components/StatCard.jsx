import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, accent = 'text-gold' }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="card flex items-center gap-4 p-5"
  >
    <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 dark:bg-paper/10 ${accent}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="font-mono text-2xl font-semibold leading-none">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-graphite">{label}</p>
    </div>
  </motion.div>
);

export default StatCard;
