import { useState, useEffect, useCallback } from 'react'
import type {
  GameState,
  GameStats,
  GameStatus,
} from '../types'
import {
  STORAGE_KEY,
  STATS_KEY,
  DEFAULT_STATE,
  DEFAULT_STATS,
  MAX_CHANCES,
  WIN_STREAK_THRESHOLD,
  LOSS_STREAK_THRESHOLD,
} from '../types'
import { getWordForLevel, getEntryByWord } from '../data/words'
import type { WordEntry } from '../data/words'

// Tier start levels: novice=1, easy=51, medium=101, hard=151, expert=201
const TIER_STARTS = [1, 51, 101, 151, 201]

function tierStartForLevel(level: number): number {
  for (let i = TIER_STARTS.length - 1; i >= 0; i--) {
    if (level >= TIER_STARTS[i]) return TIER_STARTS[i]
  }
  return 1
}

function nextTierStart(level: number): number {
  const cur = tierStartForLevel(level)
  const idx = TIER_STARTS.indexOf(cur)
  return idx < TIER_STARTS.length - 1 ? TIER_STARTS[idx + 1] : cur
}

function prevTierStart(level: number): number {
  const cur = tierStartForLevel(level)
  const idx = TIER_STARTS.indexOf(cur)
  return idx > 0 ? TIER_STARTS[idx - 1] : cur
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {}
  return { ...DEFAULT_STATE }
}

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (raw) return { ...DEFAULT_STATS, ...JSON.parse(raw) }
  } catch {}
  return { ...DEFAULT_STATS }
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function saveStats(stats: GameStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export interface UseGameStateReturn {
  state: GameState
  stats: GameStats
  wordEntry: WordEntry
  wrongGuesses: number
  isLetterGuessed: (letter: string) => boolean
  isLetterCorrect: (letter: string) => boolean
  isLetterWrong: (letter: string) => boolean
  guessLetter: (letter: string) => void
  nextWord: () => void
  retryWord: () => void
  resetGame: () => void
}

export function useGameState(): UseGameStateReturn {
  const [state, setState] = useState<GameState>(() => {
    const s = loadState()
    // Initialize activeWord if missing (first load or old save)
    if (!s.activeWord) {
      const entry = getWordForLevel(s.currentLevel, s.solvedWords)
      return { ...s, activeWord: entry.word.toLowerCase() }
    }
    return s
  })
  const [stats, setStats] = useState<GameStats>(loadStats)

  // wordEntry: look up by activeWord to get correct hint/tier (frozen until next round)
  const wordEntry: WordEntry = getEntryByWord(state.activeWord)
    ?? getWordForLevel(state.currentLevel, state.solvedWords)
  const word = state.activeWord
  const wrongGuesses = state.guessedLetters.filter(l => !word.includes(l)).length

  useEffect(() => { saveState(state) }, [state])
  useEffect(() => { saveStats(stats) }, [stats])

  const isLetterGuessed = useCallback(
    (letter: string) => state.guessedLetters.includes(letter.toLowerCase()),
    [state.guessedLetters]
  )

  const isLetterCorrect = useCallback(
    (letter: string) => state.guessedLetters.includes(letter.toLowerCase()) && word.includes(letter.toLowerCase()),
    [state.guessedLetters, word]
  )

  const isLetterWrong = useCallback(
    (letter: string) => state.guessedLetters.includes(letter.toLowerCase()) && !word.includes(letter.toLowerCase()),
    [state.guessedLetters, word]
  )

  const guessLetter = useCallback(
    (letter: string) => {
      const l = letter.toLowerCase()
      if (state.status !== 'playing') return
      if (state.guessedLetters.includes(l)) return
      if (state.chancesLeft <= 0) return

      const newGuessed = [...state.guessedLetters, l]
      const isCorrect = word.includes(l)
      const newChances = isCorrect ? state.chancesLeft : state.chancesLeft - 1
      const allRevealed = word.split('').every(ch => newGuessed.includes(ch))
      let newStatus: GameStatus = 'playing'

      if (allRevealed) {
        newStatus = 'won'
        const newWinStreak = state.winStreak + 1
        // Jump to next tier if win streak hits threshold
        const newSolvedWords = state.solvedWords.includes(word) ? state.solvedWords : [...state.solvedWords, word]
        if (newWinStreak >= WIN_STREAK_THRESHOLD) {
          const jumpLevel = nextTierStart(state.currentLevel)
          setState({
            ...DEFAULT_STATE,
            currentLevel: jumpLevel,
            activeWord: word, // keep showing current word until Next is clicked
            winStreak: 0,
            lossStreak: 0,
            status: 'won',
            guessedLetters: newGuessed,
            chancesLeft: newChances,
            solvedWords: newSolvedWords,
          })
        } else {
          setState(prev => ({ ...prev, guessedLetters: newGuessed, chancesLeft: newChances, status: 'won', winStreak: newWinStreak, lossStreak: 0, solvedWords: newSolvedWords }))
        }
        setStats(prev => {
          const streak = prev.currentStreak + 1
          return { ...prev, totalWins: prev.totalWins + 1, currentStreak: streak, bestStreak: Math.max(prev.bestStreak, streak) }
        })
      } else if (newChances <= 0) {
        newStatus = 'lost'
        const newLossStreak = state.lossStreak + 1
        // Drop to previous tier if loss streak hits threshold
        if (newLossStreak >= LOSS_STREAK_THRESHOLD) {
          const dropLevel = prevTierStart(state.currentLevel)
          setState({
            ...DEFAULT_STATE,
            currentLevel: dropLevel,
            activeWord: word, // keep showing current word until Next/Retry is clicked
            winStreak: 0,
            lossStreak: 0,
            status: 'lost',
            guessedLetters: newGuessed,
            chancesLeft: 0,
          })
        } else {
          setState(prev => ({ ...prev, guessedLetters: newGuessed, chancesLeft: 0, status: 'lost', lossStreak: newLossStreak, winStreak: 0 }))
        }
        setStats(prev => ({ ...prev, totalLosses: prev.totalLosses + 1, currentStreak: 0 }))
      } else {
        setState(prev => ({ ...prev, guessedLetters: newGuessed, chancesLeft: newChances, status: newStatus }))
      }
    },
    [state, word]
  )

  const nextWord = useCallback(() => {
    setState(prev => {
      const nextLevel = prev.currentLevel + 1
      const nextEntry = getWordForLevel(nextLevel, prev.solvedWords)
      return {
        ...DEFAULT_STATE,
        currentLevel: nextLevel,
        activeWord: nextEntry.word.toLowerCase(),
        winStreak: prev.winStreak,
        lossStreak: prev.lossStreak,
        solvedWords: prev.solvedWords,
      }
    })
  }, [])

  const retryWord = useCallback(() => {
    setState(prev => ({
      ...prev,
      guessedLetters: [],
      chancesLeft: MAX_CHANCES,
      status: 'playing',
      // activeWord stays the same — retry same word
    }))
  }, [])

  const resetGame = useCallback(() => {
    const entry = getWordForLevel(1, [])
    setState({ ...DEFAULT_STATE, activeWord: entry.word.toLowerCase() })
    setStats({ ...DEFAULT_STATS })
  }, [])

  return {
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
  }
}
