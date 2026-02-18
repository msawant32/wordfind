import { useEffect } from 'react'
import { motion } from 'framer-motion'

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
]

interface KeyboardProps {
  isLetterCorrect: (l: string) => boolean
  isLetterWrong: (l: string) => boolean
  isLetterGuessed: (l: string) => boolean
  onGuess: (l: string) => void
  disabled: boolean
}

export function Keyboard({ isLetterCorrect, isLetterWrong, isLetterGuessed, onGuess, disabled }: KeyboardProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return
      const key = e.key.toUpperCase()
      if (/^[A-Z]$/.test(key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        onGuess(key)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [disabled, onGuess])

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 sm:gap-1.5">
          {row.map((letter, li) => {
            const correct = isLetterCorrect(letter)
            const wrong = isLetterWrong(letter)
            const guessed = isLetterGuessed(letter)

            return (
              <motion.button
                key={letter}
                onClick={() => !disabled && onGuess(letter)}
                disabled={disabled || guessed}
                className="font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl select-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                style={{
                  width: 'clamp(28px, 8vw, 36px)',
                  height: 'clamp(36px, 10vw, 46px)',
                  background: correct
                    ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                    : wrong
                    ? '#fef2f2'
                    : '#fff',
                  border: correct
                    ? '2px solid #22c55e'
                    : wrong
                    ? '2px solid #fca5a5'
                    : '2px solid #e2e8f0',
                  color: correct
                    ? '#fff'
                    : wrong
                    ? '#f87171'
                    : disabled && !guessed
                    ? '#94a3b8'
                    : '#334155',
                  boxShadow: correct
                    ? '0 2px 8px rgba(22,163,74,0.25)'
                    : wrong
                    ? 'none'
                    : '0 1px 3px rgba(0,0,0,0.07)',
                  cursor: guessed || disabled ? 'default' : 'pointer',
                }}
                whileHover={!guessed && !disabled ? { scale: 1.08, y: -2, boxShadow: '0 4px 12px rgba(79,70,229,0.2)' } : {}}
                whileTap={!guessed && !disabled ? { scale: 0.93 } : {}}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (ri * 10 + li) * 0.012, duration: 0.18 }}
              >
                {letter}
              </motion.button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
