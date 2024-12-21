<script lang="ts">
   import {isPaused} from "./gameState.svelte";
   import {togglePause} from "./gameState.handlers.svelte.js";
   import {fly} from "svelte/transition";
</script>

{#if $isPaused}
    <dialog class="p-20 bg-violet-300 text-violet-500" open transition:fly={{duration: 200, y: -100}}>
        <button onclick={togglePause}>Play [space]</button>
    </dialog>
{/if}

<style>
    dialog {
        z-index: 50;
    }
</style>