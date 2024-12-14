<script lang="ts">
    import {gameStatus} from "./gameState.svelte.js";
    import {fade} from 'svelte/transition'
    import blueGhost from '$lib/assets/ghost-blue.png';
    import pinkGhost from '$lib/assets/ghost-pink.png';
    import greenGhost from '$lib/assets/ghost-green.png';
    import {groupGhostsPerColor} from "./utils";
    import type {GhostSummary} from "./types";
    import Badge from './badge.svelte'

    interface Props {
        ghosts: GhostSummary,
        label: string
    }

    const {ghosts, label}: Props = $props();

    let ghostsPerColor: Record<string, number> = $derived.by(() => groupGhostsPerColor(ghosts));

    const ghostImages: Record<string, string> = {
        blue: blueGhost,
        pink: pinkGhost,
        green: greenGhost,
    }

</script>

{#if $gameStatus === 'playing'}
    <div class="font-luckiest tracking-wide text-xl" in:fade={{duration: 200}}>
        <span>{label}:</span>
        <div class="flex gap-x-6 mt-2 mb-8 min-h-[60px]">
            {#each Object.keys(ghostsPerColor) as color}
                <div class="relative w-[50px]">
                    <img class="w-full" src={ghostImages[color]} alt={color}>
                        <Badge count={ghostsPerColor[color]} color={color}/>
                </div>
            {/each}
        </div>
    </div>
{/if}
