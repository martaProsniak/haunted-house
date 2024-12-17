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
        ghosts: GhostSummary
    }

    const {ghosts}: Props = $props();

    let ghostsPerColor: Record<string, number> = $derived.by(() => groupGhostsPerColor(ghosts));

    const ghostImages: Record<string, string> = {
        blue: blueGhost,
        pink: pinkGhost,
        green: greenGhost,
    }

</script>

{#if $gameStatus !== 'not-started'}
    <div class="h-14" in:fade={{duration: 200}}>
        <div class="flex gap-x-8 w-fit items-center">
            {#each Object.keys(ghostsPerColor) as color}
                <div class="relative">
                    <img class="w-full" src={ghostImages[color]} alt={color}>
                        <Badge count={ghostsPerColor[color]} color={color}/>
                </div>
            {/each}
        </div>
    </div>
{/if}
