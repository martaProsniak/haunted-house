<script lang="ts">
    import {gameStatus, isPaused, score, totalScore, level} from "./game.state.svelte";

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

<div class="p-2">
    <header class="text-2xl font-freckle">
        Hounted House
    </header>
    <button class="p-2 bg-pink-500 rounded-s w-40" onclick={startGame}>Start new game</button>
    <button class="p-2 bg-violet-500 rounded-s w-40" onclick={restartLevel}>Restart level</button>
    <button class="p-2 bg-orange-500 rounded-s w-40" disabled={$gameStatus !== 'playing'} onclick={togglePause}>{!$isPaused ? 'Pause' : 'Play'}</button>
</div>