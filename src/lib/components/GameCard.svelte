<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index";

  import type { GameState } from "$lib/gamestate";
  import type { BetGroup } from "$lib/bestbet";

  let {
    gameState,
    bestBetGroup,
  }: { gameState: GameState; bestBetGroup: BetGroup } = $props();

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
    <pre>{JSON.stringify(bestBetGroup, null, 2)}</pre>
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
