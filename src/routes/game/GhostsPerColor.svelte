<script lang="ts">
    import {gameStatus} from "./gameState.svelte.js";
    import {fade} from 'svelte/transition'
    import type {GhostSummary} from "./types";

    interface Props {
        ghosts: GhostSummary
    }

    const {ghosts}: Props = $props();

    let count = $derived(Object.keys(ghosts).length)

</script>

{#if $gameStatus !== 'not-started'}
    <div  in:fade={{duration: 200}}>
        <div class="flex gap-x-8 w-fit items-center">
            {#key count}
                    <div class="w-5" transition:fade|local={{duration: 300}}>{count}</div>
            {/key}
        </div>
    </div>
{/if}
