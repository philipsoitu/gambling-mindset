<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import GameCard from "$lib/components/GameCard.svelte";
  import FileDropzone from "$lib/components/FileDropzone.svelte";
  import type { GameState } from "$lib/gamestate";

  let files: File[] = $state([]);
  let games: GameState[] = $state([]);
</script>

<main
  class="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-8"
>
  <img
    class="fit-picture"
    src="/gambling_motivation.jpgg"
    alt="gambling motivation"
  />

  <div class="w-full max-w-2xl">
    <FileDropzone bind:files />
  </div>

  <div class="flex w-full flex-wrap justify-center gap-6">
    <Button
      onclick={() => {
        for (const file of files) {
          games.push({
            team1: "tdb",
            team2: "tdb",
            betGroup: { bets: [], guaranteed_return: 0 },
            odds: {
              doubleChance: { team1OrDraw: 0, team1OrTeam2: 0, team2OrDraw: 0 },
              drawNoBet: { team1: 0, team2: 0 },
              winner2Way: { team1: 0, team2: 0 },
              winner3Way: { draw: 0, team1: 0, team2: 0 },
            },
            screenshot: file,
            status: "init",
          });
        }
        files = [];
      }}
    >
      Upload files
    </Button>
    <Button onclick={() => {}}>Send screenshots to gemini</Button>

    <Button onclick={() => {}}>Calculate best game to bet on</Button>
  </div>

  <div class="flex w-full flex-wrap justify-center gap-6">
    {#each games as game}
      <GameCard gameState={game} />
    {/each}
  </div>
</main>
