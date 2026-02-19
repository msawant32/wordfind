import { useGameState } from './hooks/useGameState'
import { WordAnimation } from './components/WordAnimation'
import { WordDisplay } from './components/WordDisplay'
import { Keyboard } from './components/Keyboard'
import { EnergyOrb } from './components/EnergyOrb'
import { StatsBar } from './components/StatsBar'
import { ResultBanner } from './components/LevelBadge'
import { HintBadge } from './components/HintBadge'
import { motion } from 'framer-motion'

export default function App() {
  const {
    state,
    stats,
    wordEntry,
    wrongGuesses,
    isLetterGuessed,
    isLetterCorrect,
    isLetterWrong,
    guessLetter,
    nextWord,
    retryWord,
    resetGame,
  } = useGameState()

  const { currentLevel, guessedLetters, chancesLeft, status } = state
  const word = wordEntry.word.toLowerCase()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0f4ff', color: '#1e293b' }}>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)' }} />
        <div className="absolute top-10 -right-20 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)' }} />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center px-2 sm:px-4 pb-4 sm:pb-8" style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>

        <div className="w-full">
          <WordAnimation />
        </div>

        <motion.div
          className="w-full mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="rounded-2xl px-4 py-2.5"
            style={{ background: '#fff', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
          >
            <StatsBar level={currentLevel} stats={stats} />
          </div>
        </motion.div>

        <motion.div
          className="w-full rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-8 flex flex-col items-center gap-3 sm:gap-5"
          style={{ background: '#fff', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Orb + Word: row on md+, column on mobile */}
          <div className="flex flex-row items-center gap-4 sm:gap-6 w-full justify-center">
            <div className="shrink-0">
              <EnergyOrb chancesLeft={chancesLeft} wrongGuesses={wrongGuesses} />
            </div>
            <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
              <WordDisplay word={word} guessedLetters={guessedLetters} status={status} />
              <HintBadge hint={wordEntry.hint} wordLength={word.length} tier={wordEntry.tier} />
            </div>
          </div>

          {/* Inline result banner */}
          <ResultBanner
            status={status}
            level={currentLevel}
            word={word}
            onNext={nextWord}
            onRetry={retryWord}
          />

          <div className="w-full rounded-full" style={{ height: '1.5px', background: '#f1f5f9' }} />

          <Keyboard
            isLetterCorrect={isLetterCorrect}
            isLetterWrong={isLetterWrong}
            isLetterGuessed={isLetterGuessed}
            onGuess={guessLetter}
            disabled={status !== 'playing'}
          />
        </motion.div>

        <motion.button
          onClick={resetGame}
          className="mt-5 text-xs font-medium transition-all"
          style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ color: '#64748b' }}
        >
          Reset all progress
        </motion.button>
      </div>
    </div>
  )
}
