import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HintBadgeProps {
  hint: string
  wordLength: number
  tier: string
}

export function HintBadge({ hint, wordLength }: HintBadgeProps) {
  const [showHint, setShowHint] = useState(true)

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
        style={{ background: '#f1f5f9', border: '1.5px solid #e2e8f0', color: '#64748b' }}
      >
        <span>{wordLength} letters</span>
      </div>

      <motion.button
        onClick={() => setShowHint(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all"
        style={{
          background: showHint ? '#ede9fe' : '#f1f5f9',
          border: `1.5px solid ${showHint ? '#c4b5fd' : '#e2e8f0'}`,
          color: showHint ? '#7c3aed' : '#64748b',
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        {showHint ? 'Hide hint' : 'Show hint'}
      </motion.button>

      <AnimatePresence>
        {showHint && (
          <motion.div
            className="w-full text-center text-sm font-medium rounded-xl py-2 px-4"
            style={{ background: '#ede9fe', color: '#6d28d9', border: '1.5px solid #c4b5fd' }}
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            💡 {hint}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
