<script lang="ts">
    import {gameStatus, isPaused, score} from "./game.state.svelte";

    const startGame = () => {
        $gameStatus = 'started';
        $isPaused = false;
        $score = 0;
    }

    const togglePause = () => {
        if ($gameStatus === 'not-started') {
            return;
        }

        $isPaused = !$isPaused;
    }
</script>

<div class="p-2">
    <header class="text-2xl font-freckle">
        Hounted House
    </header>
    <button class="p-2 bg-pink-300 rounded-s" onclick={startGame}>Start new game</button>
    <button class="p-2 bg-pink-200 rounded-s" onclick={togglePause}>{!$isPaused ? 'Pause' : 'Play'}</button>
</div>