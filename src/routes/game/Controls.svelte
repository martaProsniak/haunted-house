<script lang="ts">
    import {gameStatus, isPaused} from "./gameState.svelte";
    import {togglePause, unpauseGame} from "./gameState.helpers.svelte";
    import Header from "$lib/components/Logo.svelte";
    import ControlsModal from "./ControlsModal.svelte"
    import {pauseGame} from "./gameState.helpers.svelte";
    import Button from "$lib/components/Button.svelte";

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

<ControlsModal open={showControlsModal} handleClose={closeModal}/>
<div class="space-y-20 text-xl px-6 text-center">
    <Header/>
    <div class="space-y-6">
        <Button text={`${!$isPaused ? 'Pause' : 'Play'} [ space ]`} onclick={togglePause} disabled={$gameStatus !== 'playing'} classes="w-52" />
        <Button onclick={toggleControlsModal} text={`${showControlsModal ? 'Hide controls' : 'Show controls'} [ x ]`} classes="w-52" />
    </div>
</div>

