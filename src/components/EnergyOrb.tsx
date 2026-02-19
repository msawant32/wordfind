import { motion, AnimatePresence } from 'framer-motion'
import { MAX_CHANCES } from '../types'

interface EnergyOrbProps {
  chancesLeft: number
  wrongGuesses: number
}

export function EnergyOrb({ chancesLeft }: EnergyOrbProps) {
  const used = MAX_CHANCES - chancesLeft
  const pct = chancesLeft / MAX_CHANCES

  const color = pct > 0.75
    ? { fg: '#4f46e5', bg: '#ede9fe', label: '#6d28d9' }
    : pct > 0.5
    ? { fg: '#0891b2', bg: '#e0f2fe', label: '#0369a1' }
    : pct > 0.25
    ? { fg: '#d97706', bg: '#fef3c7', label: '#b45309' }
    : { fg: '#dc2626', bg: '#fee2e2', label: '#b91c1c' }

  return (
    <div
      className="flex flex-col items-center gap-2 select-none"
      style={{ minWidth: '64px' }}
    >
      {/* Stacked heart/shield lives */}
      <div key={chancesLeft === MAX_CHANCES ? 'full' : 'used'} className="flex flex-col-reverse gap-1">
        {Array.from({ length: MAX_CHANCES }, (_, i) => {
          const isLost = i < used
          const isNext = i === used // next to be lost
          return (
            <motion.div
              key={i}
              style={{
                width: '36px',
                height: '8px',
                borderRadius: '4px',
                background: isLost ? 'rgba(0,0,0,0.07)' : color.fg,
                boxShadow: isLost ? 'none' : isNext ? `0 0 8px ${color.fg}60` : `0 0 4px ${color.fg}30`,
                border: isLost ? '1.5px solid rgba(0,0,0,0.08)' : 'none',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.18 }}
            />
          )
        })}
      </div>

      {/* Compact counter badge */}
      <motion.div
        key={chancesLeft}
        className="flex items-baseline gap-0.5"
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        <span className="font-black text-xl leading-none" style={{ color: color.fg }}>
          {chancesLeft}
        </span>
        <span className="text-xs font-semibold" style={{ color: color.label, opacity: 0.7 }}>
          /{MAX_CHANCES}
        </span>
      </motion.div>

      <span className="text-xs font-mono tracking-widest uppercase" style={{ color: color.label, opacity: 0.55, fontSize: '9px' }}>
        chances
      </span>

      {/* Warning flash when low */}
      <AnimatePresence mode="wait">
        {chancesLeft <= 2 && chancesLeft > 0 && (
          <motion.div
            key="low-warning"
            className="text-xs font-bold"
            style={{ color: '#dc2626', fontSize: '10px' }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: [1, 0.4, 1], y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.9, repeat: Infinity }}
          >
            ⚠ low
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
