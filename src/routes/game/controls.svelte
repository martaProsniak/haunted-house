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

<div class="space-y-4 font-luckiest text-xl">
    <button class="p-4 bg-violet-900 rounded-lg w-52 mb-20" disabled={$gameStatus !== 'playing'} onclick={togglePause}>{!$isPaused ? 'Pause' : 'Play'}</button>


    <button class="p-4 bg-violet-800 rounded-lg w-52" onclick={startGame}>Start new game</button>
    <button class="p-4 bg-violet-700 rounded-lg w-52" onclick={restartLevel}>Restart level</button>
</div>
