<script lang="ts">
    import {gameStatus, isPaused, score, totalScore, level} from "./gameState.svelte.js";
    import {togglePause} from "./gameStateH.handlers.svelte.js";
    import Header from "./header.svelte";

    const startGame = () => {
        $gameStatus = 'started';
        $isPaused = false;
        $score = 0;
        $totalScore = 0;
        $level = 1;
    }

    const restartLevel = () => {
        $gameStatus = 'started';
        $isPaused = false;
        $score = 0;
    }
</script>


<div class="space-y-20 font-luckiest text-xl px-6 text-center">
    <Header />
<div>
    <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-52 mb-20" disabled={$gameStatus !== 'playing'} onclick={togglePause}>
        <span>{!$isPaused ? 'Pause' : 'Play'}</span>
        <span class="">[Space]</span>
    </button>


    <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-52" onclick={startGame}>New game</button>
    <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-52" onclick={restartLevel}>Restart level</button>
</div>
</div>
