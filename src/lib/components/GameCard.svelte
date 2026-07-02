<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index";

  import type { GameState } from "$lib/gamestate";

  let { gameState }: { gameState: GameState } = $props();

  let showJson = $state(false);
  let handleShowJson = () => {
    showJson = !showJson;
  };
</script>

<Card.Root class="w-full max-w-sm">
  <Card.Header>
    <Card.Title>{gameState.team1} vs {gameState.team2}</Card.Title>
  </Card.Header>
  <Card.Content>
    <pre>{JSON.stringify(gameState.betGroup, null, 2)}</pre>
  </Card.Content>
  <Card.Footer>
    <Button size="sm" variant="secondary" onclick={handleShowJson}>
      View json
    </Button>
  </Card.Footer>
  {#if showJson}
    <Card.Content>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
    </Card.Content>
  {/if}
</Card.Root>
