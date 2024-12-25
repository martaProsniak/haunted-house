<script lang="ts">
    import {gameStatus} from "./gameState.svelte.js";
    import {fade} from 'svelte/transition'
    import {groupGhostsPerColor} from "./utils";
    import type {BaseColor, Ghost} from "./types";
    import Badge from './Badge.svelte'
    import {ghostsImages, colors} from "./constants";
    interface Props {
        ghosts: Ghost[]
    }
    const {ghosts}: Props = $props();
    let ghostsPerColor: Record<BaseColor, number> = $derived.by(() => groupGhostsPerColor(ghosts));
    let ghostsColors: BaseColor[] = Object.keys(colors) as BaseColor[];
</script>

{#if $gameStatus !== 'not-started'}
    <div class="h-14" in:fade={{duration: 200}}>
        <div class="flex gap-x-8 w-fit items-center">
            {#each ghostsColors as color}
                <div class="relative">
                    <img class="w-full" src={ghostsImages[color]} alt={color}>
                    <Badge count={ghostsPerColor[color]} color={color}/>
                </div>
            {/each}
        </div>
    </div>
{/if}