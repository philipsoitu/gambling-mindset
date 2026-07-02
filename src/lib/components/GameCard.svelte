<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import type { GameState } from "$lib/gamestate";

  let { gameState }: { gameState: GameState } = $props();
</script>

<Card.Root class="w-full max-w-sm">
  <Card.Header>
    <Card.Title>{gameState.title}</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>Current Score: {gameState.currentScore}</p>
  </Card.Content>
  <Card.Footer>
    <p>Card Footer</p>
  </Card.Footer>
</Card.Root>
