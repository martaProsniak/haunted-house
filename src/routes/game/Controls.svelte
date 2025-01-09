<script lang="ts">
    import {goto} from "$app/navigation";
    import {gameStatus, isPaused, volume} from "./gameState.svelte";
    import {togglePause, toggleSound} from "./gameState.helpers.svelte";
    import ActionButton from "./ActionButton.svelte";

    const {toggleControlsModal} = $props();


    const navigateHome = () => {
        goto("/");
    }

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

<div class="text-xl flex flex-col items-center justify-start py-4 gap-y-12 min-h-full">
    <ActionButton onclick={togglePause} disabled={$gameStatus !== 'playing'} text={!$isPaused ? 'Pause' : 'Resume'}
                  mainIcon={!$isPaused ? 'pause' : 'play'} secondaryIcon="space"/>
    <ActionButton onclick={toggleSound} text={!$volume ? 'Listen' : 'Mute'}
                  mainIcon={!$volume ? 'soundOn' : 'soundOff'} secondaryIcon="z"/>
    <ActionButton onclick={toggleControlsModal} text="Controls" mainIcon="pad" secondaryIcon="x"/>
    <ActionButton onclick={navigateHome} text="Home" mainIcon="home" secondaryIcon="a" />
</div>
