<script lang="ts">
    import {gameStatus, isPaused, volume} from "./gameState.svelte";
    import {togglePause, toggleSound} from "./gameState.helpers.svelte";
    import ActionButton from "./ActionButton.svelte";

    const {toggleControlsModal, navigateHome} = $props();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === "x") {
            toggleControlsModal();
        }
        if (e.key.toLowerCase() === "z") {
            toggleSound();
        }
        if (e.key.toLowerCase() === "a") {
            navigateHome();
        }
    }
</script>

<svelte:document on:keydown={handleKeyDown}></svelte:document>

<div class="text-xl flex flex-col items-end justify-center py-0 px-6 gap-y-8 min-h-full">
    <ActionButton onclick={togglePause} disabled={$gameStatus !== 'playing'} text={!$isPaused ? 'Pause' : 'Play'}
                  mainIcon={!$isPaused ? 'pause' : 'play'} secondaryIcon="space"/>
    <ActionButton onclick={toggleSound} text={!$volume ? 'Listen' : 'Mute'}
                  mainIcon={!$volume ? 'soundOn' : 'soundOff'} secondaryIcon="z"/>
    <ActionButton onclick={toggleControlsModal} text="Controls" mainIcon="pad" secondaryIcon="x"/>
    <ActionButton onclick={navigateHome} text="Home" mainIcon="home" secondaryIcon="a" />
</div>
