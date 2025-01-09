<script lang="ts">
    import KeyboardManual from './KeyboardManual.svelte';
    import {fly} from 'svelte/transition'
    import {isPaused} from "./gameState.svelte";

    let {open, handleClose} = $props();

    $effect(() => {
        if ($isPaused) {
            return;
        }
        handleClose();
    })
</script>

{#if open}
    <dialog class="h-full w-full text-xl px-10 py-20 flex items-center justify-center text-blue-200 bg-darkViolet" {open} in:fly={{duration: 200, y: -200}} out:fly={{duration: 300, y: -200}}>
        <KeyboardManual />
        <button class="text-right py-4 px-6 outline-violet-600 hover:bg-black cursor-pointer rounded-bl-lg absolute top-0 right-0" onclick={handleClose}>
            X
        </button>
    </dialog>
{/if}

<style>
    dialog {
        z-index: 45;
        border: 4px black solid;
        border-radius: 8px;
    }
</style>