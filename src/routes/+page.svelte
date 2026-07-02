<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import { Label } from "$lib/components/ui/label/index";
  import GameCard from "$lib/components/GameCard.svelte";
  import type { GameState } from "$lib/gamestate";

  const testGameState: GameState = {
    title: "yoyoyo",
    currentScore: 0,
  };
</script>

<Button>Click me</Button>
<Label for="email">Your email address</Label>

<GameCard gameState={testGameState} />
