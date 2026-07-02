import type { GameState } from "$lib/gamestate";

export type BetGroup = {
  bets: Bet[],
  guaranteed_return: number,
};

type Bet = {
  category: "winner3Way" | "winner2Way" | "doubleChance" | "drawNoBet"
  pick: string
  amount: number
  isFreeBet: boolean
  return: number
};

export const bestBetCalculator = (gamestate: GameState): BetGroup => {

  let bestBetGroup: BetGroup = {
    bets: [],
    guaranteed_return: 0,
  }



  // TODO: handle winner3Way + doubleChance

  const best2Way = bestWinner2Way(gamestate)
  if (best2Way.guaranteed_return > bestBetGroup.guaranteed_return) {
    bestBetGroup = best2Way
  }

  return bestBetGroup
}



const bestWinner2Way = (gamestate: GameState): BetGroup => {

  let team_a = ""
  let team_b = ""
  let a = 0
  let b = 0

  if (gamestate.winner2Way.team1 > gamestate.winner2Way.team2) {
    team_a = gamestate.team1
    team_b = gamestate.team2
    a = gamestate.winner2Way.team1
    b = gamestate.winner2Way.team2
  } else {
    team_a = gamestate.team2
    team_b = gamestate.team1
    a = gamestate.winner2Way.team2
    b = gamestate.winner2Way.team1
  }

  let x = 10 * (a - 1) / b

  let profit_a = 10 * a - x
  let profit_b = x * (b - 1)

  let bg: BetGroup = {
    bets: [
      { amount: 10, category: "winner2Way", pick: team_a, isFreeBet: true, return: profit_a },
      { amount: x, category: "winner2Way", pick: team_b, isFreeBet: false, return: profit_b },
    ],
    guaranteed_return: Math.min(profit_a, profit_b)
  }

  return bg



}
