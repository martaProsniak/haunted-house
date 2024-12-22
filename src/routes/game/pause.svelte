<script lang="ts">
   import {isPaused} from "./gameState.svelte";
   import {togglePause} from "./gameState.helpers.svelte.js";
   import {fly} from "svelte/transition";
</script>

{#if $isPaused}
    <dialog class="px-40 bg-stone-950 h-2/3 text-white font-luckiest flex items-center" open transition:fly={{duration: 300, y: -200}}>
        <button onclick={togglePause}>Play [space]</button>
    </dialog>
{/if}

<style>
    dialog {
        z-index: 40;
    }
</style>