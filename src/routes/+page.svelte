<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import GameCard from "$lib/components/GameCard.svelte";
  import FileDropzone from "$lib/components/FileDropzone.svelte";
  import type { GameState, Odds, ParsedGame } from "$lib/gamestate";

  let files: File[] = $state([]);
  let games: GameState[] = $state([]);
  let isParsing = $state(false);

  const emptyOdds = (): Odds => ({
    doubleChance: { team1OrDraw: 0, team1OrTeam2: 0, team2OrDraw: 0 },
    drawNoBet: { team1: 0, team2: 0 },
    winner2Way: { team1: 0, team2: 0 },
    winner3Way: { draw: 0, team1: 0, team2: 0 },
  });

  async function sendInitGamesToGemini() {
    const initGames = games
      .map((game, index) => ({ game, index }))
      .filter(({ game }) => game.status === "init");

    if (!initGames.length) return;

    isParsing = true;
    const formData = new FormData();
    for (const { game } of initGames)
      formData.append("images", game.screenshot);

    try {
      const response = await fetch("/api/convertScreenshotToBets", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error ?? "Failed to parse odds.");

      for (const parsedGame of payload.games as ({
        index: number;
      } & ParsedGame)[]) {
        const gameIndex = initGames[parsedGame.index]?.index;
        if (gameIndex === undefined) continue;
        games[gameIndex].team1 = parsedGame.team1;
        games[gameIndex].team2 = parsedGame.team2;
        games[gameIndex].odds = parsedGame.odds;
        games[gameIndex].status = "parsed";
      }
    } catch (error) {
      console.error(error);
      for (const { index } of initGames) games[index].status = "error";
    } finally {
      isParsing = false;
    }
  }
</script>

<main
  class="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-8"
>
  <img
    class="fit-picture"
    src="/gambling_motivation.jpg"
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
            odds: emptyOdds(),
            screenshot: file,
            status: "init",
          });
        }
        files = [];
      }}
    >
      Upload files
    </Button>
    <Button onclick={sendInitGamesToGemini} disabled={isParsing}>
      {isParsing ? "Sending..." : "Send screenshots to gemini"}
    </Button>

    <Button onclick={() => {}}>Calculate best game to bet on</Button>
  </div>

  <div class="flex w-full flex-wrap justify-center gap-6">
    {#each games as game}
      <GameCard gameState={game} />
    {/each}
  </div>
</main>
