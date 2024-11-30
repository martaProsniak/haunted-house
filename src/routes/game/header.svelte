<script lang="ts">
    import {gameStatus} from "./game.state.svelte";

    const startGame = () => {
        $gameStatus = 'playing';
    }

    const togglePause = () => {
        if ($gameStatus === 'not-started') {
            return;
        }

        $gameStatus = $gameStatus !== 'paused' ? 'paused' : 'playing';
    }
</script>

<div class="p-2">
    <header class="text-2xl font-freckle">
        Hounted House
    </header>
    <button class="p-2 bg-pink-300 rounded-s" onclick={startGame}>Start game</button>
    <button class="p-2 bg-pink-200 rounded-s" onclick={togglePause}>{$gameStatus !== 'paused' ? 'Pause' : 'Play'}</button>
</div>