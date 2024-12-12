<script lang="ts">
    import {layers, totalGhosts} from "./gameState.svelte.js";
    import {fade} from 'svelte/transition'
    import blueGhost from '$lib/assets/ghost-blue.png';
    import pinkGhost from '$lib/assets/ghost-pink.png';
    import greenGhost from '$lib/assets/ghost-green.png';

    const {startGame, restartLevel, togglePause, isPlaying, isPaused} = $props();

    let catchCount = $derived(Object.keys(layers.catchGhosts).length)

    let escapedCount = $derived(Object.keys(layers.escapedGhosts).length)

    let catchGhostsPerColor: Record<string, number> = $derived.by(() => {
        return Object.values(layers.catchGhosts).reduce((acc, ghost) => {
            acc[ghost.color]++;
            return acc;
        }, {pink: 0, blue: 0, green: 0})
    })

    let escapedGhostsPerColor: Record<string, number> = $derived.by(() => {
        return Object.values(layers.escapedGhosts).reduce((acc, ghost) => {
            acc[ghost.color]++;
            return acc;
        }, {pink: 0, blue: 0, green: 0})
    })

    const ghostImages: Record<string, string> = {
        blue: blueGhost,
        pink: pinkGhost,
        green: greenGhost,
    }


</script>

<div class="text-l space-y-4">
    <button class="p-2 bg-pink-500 rounded-s w-40" onclick={startGame}>Start new game</button>
    <button class="p-2 bg-violet-500 rounded-s w-40" onclick={restartLevel}>Restart level</button>
    <button class="p-2 bg-orange-500 rounded-s w-40" disabled={!isPlaying} onclick={togglePause}>{!isPaused ? 'Pause' : 'Play'}</button>
    <div>
        <span>Catch ghosts: {catchCount} / {$totalGhosts}</span>
        <div class="flex gap-x-4 mt-2 mb-8 h-[48px]">
            {#each Object.keys(catchGhostsPerColor) as color}
                {#if catchGhostsPerColor[color] > 0}
                    <div class="relative" in:fade={{duration: 200}}>
                        <img src={ghostImages[color]} alt={color}>
                        <div class="absolute bg-white text-stone-900 rounded-full  count">{catchGhostsPerColor[color]}</div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>

    <div>
        <span>Escaped ghosts: {escapedCount} / {$totalGhosts}</span>
        <div class="flex gap-x-4 mt-2 mb-8 h-[48px]">
            {#each Object.keys(escapedGhostsPerColor) as color}
                {#if escapedGhostsPerColor[color] > 0}
                    <div class="relative" in:fade={{duration: 200}}>
                        <img src={ghostImages[color]} alt={color}>
                        <div class="absolute bg-white text-stone-900 rounded-full  count">{escapedGhostsPerColor[color]}</div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    .count {
        width: 24px;
        height: 24px;
        top: 24px;
        left: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>