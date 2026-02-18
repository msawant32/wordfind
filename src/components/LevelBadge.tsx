import { motion, AnimatePresence } from 'framer-motion'

interface ResultBannerProps {
  status: 'playing' | 'won' | 'lost'
  level: number
  word: string
  onNext: () => void
  onRetry: () => void
}

const CONFETTI_COLORS = ['#4f46e5', '#7c3aed', '#16a34a', '#d97706', '#db2777', '#0891b2']

function Particle({ color, index }: { color: string; index: number }) {
  const x = (Math.random() - 0.5) * 400
  const y = -(Math.random() * 160 + 60)
  const rotate = Math.random() * 540 - 270
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: Math.random() * 8 + 4,
        height: Math.random() * 8 + 4,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        background: color,
        top: '20px',
        left: '50%',
        zIndex: 10,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y: [0, y, y + 60], opacity: [1, 1, 0], rotate, scale: [1, 1, 0.3] }}
      transition={{ duration: 1.1 + Math.random() * 0.4, ease: 'easeOut', delay: index * 0.015 }}
    />
  )
}

export function ResultBanner({ status, level, word, onNext, onRetry }: ResultBannerProps) {
  const isWon = status === 'won'

  return (
    <AnimatePresence>
      {status !== 'playing' && (
        <motion.div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{
            background: isWon ? '#f0fdf4' : '#fff8f8',
            border: `1.5px solid ${isWon ? '#bbf7d0' : '#fecaca'}`,
          }}
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        >
          {/* Confetti inside banner */}
          {isWon && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 36 }, (_, i) => (
                <Particle key={i} color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]} index={i} />
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 px-5 py-4">
            {/* Icon + message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <motion.span
                className="text-3xl shrink-0"
                animate={{ scale: [1, 1.3, 1], rotate: isWon ? [0, -8, 8, 0] : [0, -4, 4, 0] }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                {isWon ? '🎉' : '😅'}
              </motion.span>

              <div className="min-w-0">
                <motion.p
                  className="font-black text-base leading-tight"
                  style={{ color: isWon ? '#15803d' : '#dc2626' }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {isWon ? 'Correct! Well done!' : 'Out of chances!'}
                </motion.p>
                <motion.p
                  className="text-xs mt-0.5 truncate"
                  style={{ color: '#64748b' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {isWon
                    ? `Level ${level} complete · Win streak building!`
                    : <>The word was <strong className="font-black uppercase" style={{ color: '#dc2626' }}>{word}</strong></>
                  }
                </motion.p>
              </div>
            </div>

            {/* Action buttons */}
            <motion.div
              className="flex gap-2 shrink-0"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              {!isWon && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: '#fff',
                    border: '1.5px solid #e2e8f0',
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  Try Again
                </button>
              )}
              <button
                onClick={onNext}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white transition-all"
                style={{
                  background: isWon
                    ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                    : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isWon ? '0 2px 12px rgba(22,163,74,0.3)' : '0 2px 12px rgba(79,70,229,0.25)',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {isWon ? 'Next →' : 'Skip →'}
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
