<script lang="ts">
    import KeyboardManual from './KeyboardManual.svelte';
    import {fly} from 'svelte/transition'

    let {open, handleClose} = $props();
</script>

{#if open}
    <dialog class="py-24 px-16 text-violet-200 bg-darkViolet text-xl" {open} in:fly={{duration: 200, y: -200}} out:fly={{duration: 300, y: -200}}>
        <KeyboardManual />
        <button class="p-2 px-4 outline-violet-600 rounded-lg cursor-pointer absolute top-4 right-4" onclick={handleClose}>
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

    dialog::backdrop {
        background-color: black;
    }
</style>