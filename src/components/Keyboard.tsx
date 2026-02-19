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
                className="font-bold rounded-xl select-none focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-95"
                style={{
                  fontSize: 'clamp(13px, 3.5vw, 18px)',
                  width: 'clamp(30px, 8.5vw, 46px)',
                  height: 'clamp(44px, 12vw, 58px)',
                  background: correct
                    ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                    : wrong
                    ? '#fef2f2'
                    : guessed
                    ? '#f8fafc'
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
                    ? '0 3px 10px rgba(22,163,74,0.3)'
                    : wrong
                    ? 'none'
                    : '0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
                  cursor: guessed || disabled ? 'default' : 'pointer',
                  touchAction: 'manipulation',
                }}
                whileHover={!guessed && !disabled ? { scale: 1.1, y: -2, boxShadow: '0 6px 16px rgba(79,70,229,0.25)' } : {}}
                whileTap={!guessed && !disabled ? { scale: 0.9 } : {}}
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
