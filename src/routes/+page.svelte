<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import GameCard from "$lib/components/GameCard.svelte";
  import { bestBetCalculator, type BetGroup } from "$lib/bestbet";
  import type { GameState } from "$lib/gamestate";

  const testGameState: GameState = $state({
    team1: "Austria",
    team2: "Spain",
    winner3Way: {
      team1: 9.5,
      draw: 5,
      team2: 1.33,
    },
    winner2Way: {
      team1: 6.25,
      team2: 1.12,
    },
    doubleChance: {
      team2OrDraw: 1.05,
      team1OrDraw: 3.25,
      team1OrTeam2: 1.16,
    },
    drawNoBet: {
      team1: 7,
      team2: 1.06,
    },
  });

  let bestBetGroup: BetGroup = $state({ bets: [], guaranteed_return: 0 });

  const updateBestBetGroup = () => {
    bestBetGroup = bestBetCalculator(testGameState);
  };
</script>

<img
  class="fit-picture"
  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJB7sR7ymtZ1TDYf97EBI8cys-MFTtvuBteuxZpiOq480vJn-qhS4ZF5g"
  alt="Grapefruit slice atop a pile of other slices"
/>

<Button onclick={updateBestBetGroup}>Update best bet</Button>

<GameCard gameState={testGameState} bestBetGroup={bestBetGroup} />
