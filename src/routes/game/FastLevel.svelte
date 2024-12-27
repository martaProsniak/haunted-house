<script lang="ts">
    import {level} from "./gameState.svelte";
    import {fly} from "svelte/transition";
</script>

{#if $level % 3 === 0}
    <div class="absolute top-[-36px] left-1/2 -translate-x-1/2 font-cherryBomb text-2xl shadow" transition:fly={{duration: 300, y: -100}}>
        Fast level!
    </div>
{/if}

<style>
    .shadow {
        text-shadow: 0 2px 0.1em #ec3597, 0 2px 0.2em #2398ec, 0 0 0.1em #45e732;
    }
</style>