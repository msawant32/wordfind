import { motion } from 'framer-motion'
import { MAX_CHANCES } from '../types'

interface EnergyOrbProps {
  chancesLeft: number
  wrongGuesses: number
}

export function EnergyOrb({ chancesLeft, wrongGuesses }: EnergyOrbProps) {
  const pct = chancesLeft / MAX_CHANCES

  const getColor = () => {
    if (pct > 0.75) return { primary: '#4f46e5', secondary: '#7c3aed', glow: 'rgba(79,70,229,0.2)', dot: '#4f46e5' }
    if (pct > 0.5)  return { primary: '#0891b2', secondary: '#0284c7', glow: 'rgba(8,145,178,0.2)', dot: '#0891b2' }
    if (pct > 0.25) return { primary: '#d97706', secondary: '#ea580c', glow: 'rgba(217,119,6,0.2)', dot: '#d97706' }
    return { primary: '#dc2626', secondary: '#b91c1c', glow: 'rgba(220,38,38,0.2)', dot: '#dc2626' }
  }

  const { primary, secondary, glow, dot } = getColor()
  const size = 120

  const crackPaths = [
    'M60,30 L55,50 L45,55',
    'M60,30 L70,48 L78,42',
    'M30,60 L50,58 L48,70',
    'M90,60 L72,62 L75,75',
    'M45,85 L55,70 L65,78',
    'M60,90 L58,72 L70,65',
    'M25,45 L40,50 L35,65',
    'M95,45 L80,52 L85,68',
    'M40,20 L50,40 L40,50',
    'M80,20 L70,40 L80,52',
    'M15,70 L35,65 L40,80',
    'M105,70 L85,67 L82,82',
  ].slice(0, wrongGuesses)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <motion.div
          className="absolute rounded-full"
          style={{ width: size + 20, height: size + 20, background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg width={size} height={size} viewBox="0 0 120 120" className="relative z-10">
          <defs>
            <radialGradient id="orbGrad" cx="38%" cy="32%" r="62%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="40%" stopColor={primary} stopOpacity="0.85" />
              <stop offset="100%" stopColor={secondary} stopOpacity="0.95" />
            </radialGradient>
            <radialGradient id="innerGlow" cx="38%" cy="32%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <filter id="softShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={primary} floodOpacity="0.3" />
            </filter>
          </defs>

          <circle cx="60" cy="60" r="52" fill="url(#orbGrad)" filter="url(#softShadow)" />
          <ellipse cx="44" cy="40" rx="16" ry="10" fill="url(#innerGlow)" />

          <motion.circle
            cx="60" cy="60" r="46"
            fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="16 10"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '60px 60px' }}
          />

          {crackPaths.map((d, i) => (
            <motion.path
              key={i} d={d} fill="none"
              stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.35 }}
            />
          ))}

          <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.25" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <motion.div
              className="font-black text-2xl leading-none"
              style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
              key={chancesLeft}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {chancesLeft}
            </motion.div>
            <div className="text-xs font-mono opacity-80 tracking-widest text-white">LEFT</div>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap justify-center" style={{ maxWidth: '160px' }}>
        {Array.from({ length: MAX_CHANCES }, (_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: '9px',
              height: '9px',
              background: i < chancesLeft ? dot : 'rgba(0,0,0,0.1)',
              boxShadow: i < chancesLeft ? `0 0 5px ${dot}60` : 'none',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.03 }}
          />
        ))}
      </div>
    </div>
  )
}
