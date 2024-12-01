<script lang="ts">
    import {layers} from "./game.state.svelte";

    import blueGhost from '$lib/assets/ghost-blue.png';
    import pinkGhost from '$lib/assets/ghost-pink.png';
    import greenGhost from '$lib/assets/ghost-green.png';

    const ghostImages: Record<string, string> = {
        blue: blueGhost,
        pink: pinkGhost,
        green: greenGhost,
    }
</script>

<div class="text-xs">
    <div>
        <span>Catch ghosts:</span>
        <div class="flex gap-x-4 mt-2 mb-8">
            {#each Object.keys(layers.catchGhosts) as color}
                {#if layers.catchGhosts[color] > 0}
                    <div class="relative">
                        <img src={ghostImages[color]} alt={color}>
                        <div class="absolute bg-white text-stone-900 rounded-full  count">{layers.catchGhosts[color]}</div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>

    <div>
        <span>Escaped ghosts:</span>
        <div class="flex gap-x-4 mt-2">
            {#each Object.keys(layers.escapedGhosts) as color}
                {#if layers.escapedGhosts[color] > 0}
                    <div class="relative">
                        <img src={ghostImages[color]} alt={color}>
                        <div class="absolute bg-white text-stone-900 rounded-full  count">{layers.catchGhosts[color]}</div>
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