<script lang="ts">
   import {isPaused} from "./gameState.svelte";
   import {togglePause} from "./gameState.helpers.svelte.js";
   import {fly} from "svelte/transition";
</script>

{#if $isPaused}
    <dialog class="py-20 px-36 text-violet-200  font-cherryBomb flex items-center justify-center h-full w-full text-xl" open={$isPaused} transition:fly={{duration: 300, y: -200}}>
        <button onclick={togglePause}>Resume [space]</button>
    </dialog>
{/if}

<style>
    dialog {
        z-index: 40;
        background-color: rgba(1, 1, 2, 0.74);
    }
</style>