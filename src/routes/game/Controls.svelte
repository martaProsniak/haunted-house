<script lang="ts">
    import {gameStatus, isPaused} from "./gameState.svelte";
    import {togglePause, unpauseGame} from "./gameState.helpers.svelte";
    import Header from "$lib/components/Logo.svelte";
    import ControlsModal from "./ControlsModal.svelte"
    import {pauseGame} from "./gameState.helpers.svelte";
    import Button from "$lib/components/Button.svelte";
    import PauseIcon from "$lib/components/icons/PauseIcon.svelte";
    import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
    import SpaceBarIcon from "$lib/components/icons/SpaceBarIcon.svelte";
    import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
    import PadIcon from "$lib/components/icons/PadIcon.svelte";

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

{#snippet spaceBarInBrackets()}
    <div class="flex items-end gap-x-0">
        <span>[</span>
        <SpaceBarIcon/>
        <span>]</span>
    </div>
{/snippet}

{#snippet xIconInBrackets()}
    <div class="flex items-end gap-x-0">
        <span>[</span>
        <CloseIcon/>
        <span>]</span>
    </div>
{/snippet}

{#snippet paused()}
    <PlayIcon/>
    <span>Play</span>
    {@render spaceBarInBrackets()}
{/snippet}

{#snippet playing()}
    <PauseIcon/>
    <span>Pause</span>
    {@render spaceBarInBrackets()}
{/snippet}

<ControlsModal open={showControlsModal} handleClose={closeModal}/>
<div class="space-y-20 text-xl text-center">
    <div class="space-y-6 w-36 mx-auto px-4">
        <Button onclick={togglePause} disabled={$gameStatus !== 'playing'} classes="">
            <div class="flex flex-col items-center gap-y-0.25 w-fit mx-auto">
                {#if !$isPaused}
                    {@render playing()}
                {:else }
                    {@render paused()}
                {/if}
            </div>
        </Button>
        <Button onclick={toggleControlsModal} classes="">
            <div class="flex flex-col items-center gap-y-0.25 w-fit mx-auto">
                <PadIcon/>
                <span>Controls</span>
                {@render xIconInBrackets()}
            </div>
        </Button>
    </div>
</div>

