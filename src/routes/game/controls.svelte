<script lang="ts">
    import {gameStatus, isPaused} from "./gameState.svelte.js";
    import {togglePause, startGame, restartLevel} from "./gameState.handlers.svelte.js";
    import Header from "./header.svelte";
</script>


<div class="space-y-20 font-luckiest text-xl px-6 text-center">
    <Header/>
    <div class="space-y-6">
        <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-52 mb-20"
                disabled={$gameStatus !== 'playing'} onclick={togglePause}>
            <span>{!$isPaused ? 'Pause' : 'Play'}</span>
            <span class="">[Space]</span>
        </button>


        <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-52"
                onclick={startGame}>New game
        </button>
        <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-52"
                onclick={restartLevel}>Restart level
        </button>
    </div>
</div>
