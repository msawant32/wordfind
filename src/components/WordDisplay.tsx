import { motion, AnimatePresence } from 'framer-motion'

interface WordDisplayProps {
  word: string
  guessedLetters: string[]
  status: 'playing' | 'won' | 'lost'
}

export function WordDisplay({ word, guessedLetters, status }: WordDisplayProps) {
  const letters = word.split('')

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="flex flex-wrap justify-center gap-2 md:gap-3"
        animate={status === 'lost' ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {letters.map((letter, i) => {
          const isRevealed = guessedLetters.includes(letter) || status === 'lost'
          const isCorrect = guessedLetters.includes(letter)

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="relative flex items-center justify-center rounded-xl transition-all duration-300"
                style={{
                  width: '46px',
                  height: '54px',
                  background: isCorrect
                    ? '#f0fdf4'
                    : status === 'lost' && !isCorrect
                    ? '#fff1f2'
                    : '#fff',
                  border: `2px solid ${
                    isCorrect
                      ? '#86efac'
                      : status === 'lost' && !isCorrect
                      ? '#fca5a5'
                      : '#e2e8f0'
                  }`,
                  boxShadow: isCorrect
                    ? '0 2px 10px rgba(22,163,74,0.12)'
                    : '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <AnimatePresence>
                  {isRevealed && (
                    <motion.span
                      className="font-mono font-black text-2xl uppercase"
                      style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}
                      initial={{ scale: 0, rotateY: 90, opacity: 0 }}
                      animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 20, delay: i * 0.045 }}
                    >
                      {letter}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: '36px',
                  height: '3px',
                  background: isCorrect
                    ? '#22c55e'
                    : status === 'lost' && !isCorrect
                    ? '#f87171'
                    : '#cbd5e1',
                }}
              />
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
