import { type BetGroup } from "$lib/bestbet";

export type GameState = {
  team1: string,
  team2: string,
  screenshot: File,
  odds: Odds,
  betGroup: BetGroup,
  status: 'init' | 'parsed' | 'calculated' | 'error'
};

export type Odds = {
  winner3Way: {
    team1: number,
    draw: number,
    team2: number,
  },
  winner2Way: {
    team1: number,
    team2: number,
  },
  doubleChance: {
    team1OrDraw: number,
    team2OrDraw: number,
    team1OrTeam2: number,
  },
  drawNoBet: {
    team1: number,
    team2: number,
  },
}
