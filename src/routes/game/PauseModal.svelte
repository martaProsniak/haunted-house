<script lang="ts">
   import {isPaused} from "./gameState.svelte";
   import {togglePause} from "./gameState.helpers.svelte.js";
   import {fly} from "svelte/transition";
   import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
   import SpaceBarIcon from "$lib/components/icons/SpaceBarIcon.svelte";
</script>

{#if $isPaused}
    <dialog class="py-20 px-36 bg-semi-transparent flex items-center justify-center text-blue-200 h-full w-full text-xl" open={$isPaused} transition:fly={{duration: 300, y: -200}}>
        <button onclick={togglePause} class="cursor-pointer  hover:text-blue-300 hover:rotate-2 transition-all">
            <span class="inline-block mx-auto"><PlayIcon /></span>
            <span>Resume</span>
            <span class="mx-auto flex items-center justify-center">
                <span>[</span>
                <SpaceBarIcon />
                <span>]</span>
            </span>
        </button>
    </dialog>
{/if}

<style>
    dialog {
        z-index: 40;
        /*background-color: rgba(1, 1, 2, 0.74);*/
    }
</style>