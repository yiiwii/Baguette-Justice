export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum EnemyState {
  WORKING = 'WORKING',       // Back turned, safe
  ALERT = 'ALERT',           // About to turn, warning
  WATCHING = 'WATCHING',     // Turned around, dangerous
  HIT = 'HIT',               // Stunned animation
  CAUGHT_YOU = 'CAUGHT_YOU'  // Game Over animation (smiling)
}

export enum PlayerAction {
  IDLE = 'IDLE',
  CHARGING = 'CHARGING',
  SWINGING = 'SWINGING'
}