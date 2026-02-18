import type { Tier } from './data/words'

export type GameStatus = 'playing' | 'won' | 'lost'

export interface GameState {
  version: number
  currentLevel: number
  guessedLetters: string[]
  chancesLeft: number
  status: GameStatus
  winStreak: number
  lossStreak: number
  solvedWords: string[]
}

export interface GameStats {
  totalWins: number
  totalLosses: number
  bestStreak: number
  currentStreak: number
}

export const STORAGE_KEY = 'guessword-state-v1'
export const STATS_KEY = 'guessword-stats-v1'
export const MAX_CHANCES = 8
export const WIN_STREAK_THRESHOLD = 8
export const LOSS_STREAK_THRESHOLD = 5

export const DEFAULT_STATE: GameState = {
  version: 1,
  currentLevel: 1,
  guessedLetters: [],
  chancesLeft: MAX_CHANCES,
  status: 'playing',
  winStreak: 0,
  lossStreak: 0,
  solvedWords: [],
}

export const DEFAULT_STATS: GameStats = {
  totalWins: 0,
  totalLosses: 0,
  bestStreak: 0,
  currentStreak: 0,
}

export type { Tier }
