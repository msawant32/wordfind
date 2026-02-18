import { motion } from 'framer-motion'
import { TIER_COLORS, getTierForLevel } from '../data/words'
import type { GameStats } from '../types'

interface StatsBarProps {
  level: number
  stats: GameStats
}

export function StatsBar({ level, stats }: StatsBarProps) {
  const tier = getTierForLevel(level)
  const tierColor = TIER_COLORS[tier]

  return (
    <div className="flex items-center justify-between w-full gap-4 flex-wrap">
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
          style={{
            background: `${tierColor}15`,
            border: `1.5px solid ${tierColor}40`,
            color: tierColor,
          }}
        >
          <span className="text-xs opacity-70 font-mono">#</span>
          <span className="text-lg leading-none font-black">{level}</span>
           
        </div>
      </motion.div>

      <div className="flex items-center gap-5">
        <StatPill label="Wins" value={stats.totalWins} color="#16a34a" />
        <StatPill label="Streak" value={stats.currentStreak} color="#4f46e5" />
        <StatPill label="Best" value={stats.bestStreak} color="#7c3aed" />
      </div>
    </div>
  )
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        className="font-black text-xl leading-none"
        style={{ color }}
        key={value}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {value}
      </motion.span>
      <span className="text-xs font-mono uppercase tracking-wider" style={{ color: '#94a3b8' }}>{label}</span>
    </div>
  )
}
