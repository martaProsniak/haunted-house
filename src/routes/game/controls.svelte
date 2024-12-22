<script lang="ts">
    import {gameStatus, isPaused} from "./gameState.svelte.js";
    import {togglePause, startGame, restartLevel, unpauseGame} from "./gameState.helpers.svelte.js";
    import Header from "./header.svelte";
    import ControlsModal from "./controlsModal.svelte"
    import {pauseGame} from "./gameState.helpers.svelte.js";

    let showControlsModal = $state(false);

    const showModal = () => {
        pauseGame();
        showControlsModal = true;
    }

    const closeModal = () => {
        unpauseGame();
        showControlsModal = false;
    }

    const toggleControlsModal = () => {
        if (!showControlsModal) {
            showModal();
            return;
        }
        closeModal();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === "x") {
            toggleControlsModal();
        }
    }
</script>

<svelte:document on:keydown={handleKeyDown}></svelte:document>

<ControlsModal open={showControlsModal} handleClose={closeModal} />
<div class="space-y-20 font-luckiest text-xl px-6 text-center">
    <Header/>
    <div class="space-y-6">
        <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-60 mb-20"
                disabled={$gameStatus !== 'playing'} onclick={togglePause}>
            <span>{!$isPaused ? 'Pause' : 'Play'}</span>
            <span class="">[Space]</span>
        </button>

        <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-60"
                onclick={toggleControlsModal}>{showControlsModal ? 'Hide controls' : 'Show controls'} [x]
        </button>


        <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-60"
                onclick={startGame}>New game
        </button>
        <button class="p-4 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg w-60"
                onclick={restartLevel}>Restart level
        </button>
    </div>
</div>

