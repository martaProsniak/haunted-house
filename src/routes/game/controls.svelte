<script lang="ts">
    import {gameStatus, isPaused, score, totalScore, level} from "./gameState.svelte.js";

    const startGame = () => {
        $gameStatus = 'started';
        $isPaused = false;
        $score = 0;
        $totalScore = 0;
        $level = 1;
    }

    const togglePause = () => {
        if ($gameStatus === 'not-started') {
            return;
        }

        $isPaused = !$isPaused;
    }

    const restartLevel = () => {
        $gameStatus = 'started';
        $isPaused = false;
        $score = 0;
    }
</script>

<div class="space-y-4 font-luckiest text-xl px-6 text-right">
    <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-52 mb-20" disabled={$gameStatus !== 'playing'} onclick={togglePause}>{!$isPaused ? 'Pause' : 'Play'}</button>


    <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-52" onclick={startGame}>New game</button>
    <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-52" onclick={restartLevel}>Restart level</button>
</div>
