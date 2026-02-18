import { useMemo } from 'react'
import { motion } from 'framer-motion'

const FLOATING_WORDS = [
  'cosmos', 'aurora', 'zenith', 'cipher', 'nebula',
  'quartz', 'lyric', 'fable', 'raven', 'mystic',
  'ember', 'vortex', 'prism', 'odyssey', 'solace',
  'fractal', 'echo', 'glyph', 'axiom', 'lumen',
  'storm', 'twilight', 'radiant', 'whisper', 'dream',
]

interface FloatingWord {
  id: number
  text: string
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

function generateWords(): FloatingWord[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    text: FLOATING_WORDS[i % FLOATING_WORDS.length],
    x: Math.random() * 90,
    y: Math.random() * 80,
    size: Math.random() * 1.0 + 0.55,
    opacity: Math.random() * 0.18 + 0.06,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -25,
  }))
}

function FloatingWord({ word }: { word: FloatingWord }) {
  const xOffset = (Math.random() - 0.5) * 100
  const yOffset = (Math.random() - 0.5) * 50

  return (
    <motion.span
      className="absolute select-none pointer-events-none font-mono tracking-widest uppercase"
      style={{
        left: `${word.x}%`,
        top: `${word.y}%`,
        fontSize: `${word.size}rem`,
        color: `rgba(99,102,241,${word.opacity})`,
      }}
      animate={{
        x: [0, xOffset, xOffset * 0.5, 0],
        y: [0, yOffset, -yOffset * 0.3, 0],
        opacity: [word.opacity, word.opacity * 1.8, word.opacity * 0.5, word.opacity],
      }}
      transition={{ duration: word.duration, delay: word.delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {word.text}
    </motion.span>
  )
}

const WORD_CHARS = ['W','o','r','d']
const FIND_CHARS = ['F','i','n','d']

export function WordAnimation() {
  const floatingWords = useMemo(() => generateWords(), [])

  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ height: '64px' }}>
      <div className="absolute inset-0">
        {floatingWords.map(word => (
          <FloatingWord key={word.id} word={word} />
        ))}
      </div>

      <div className="relative flex items-center gap-3">
        {/* Icon mark */}
        <motion.div
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.95" />
            <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.35" />
            <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.35" />
            <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.95" />
          </svg>
        </motion.div>

        {/* Wordmark */}
        <div className="flex items-baseline">
          {WORD_CHARS.map((char, i) => (
            <motion.span
              key={`w${i}`}
              className="font-display font-black text-2xl md:text-3xl leading-none tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: [0, -2.5, 0] }}
              transition={{
                opacity: { duration: 0.25, delay: i * 0.04 },
                y: { duration: 2.4 + i * 0.18, repeat: Infinity, ease: 'easeInOut', delay: i * 0.09 },
              }}
            >{char}</motion.span>
          ))}
          {FIND_CHARS.map((char, i) => (
            <motion.span
              key={`f${i}`}
              className="font-display font-black text-2xl md:text-3xl leading-none tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: [0, -2.5, 0] }}
              transition={{
                opacity: { duration: 0.25, delay: (i + 4) * 0.04 },
                y: { duration: 2.4 + (i + 4) * 0.18, repeat: Infinity, ease: 'easeInOut', delay: (i + 4) * 0.09 },
              }}
            >{char}</motion.span>
          ))}
        </div>

        <motion.span
          className="text-xs font-mono tracking-widest uppercase hidden sm:block"
          style={{ color: 'rgba(99,102,241,0.38)', paddingBottom: '1px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          · guess the word
        </motion.span>
      </div>
    </div>
  )
}
