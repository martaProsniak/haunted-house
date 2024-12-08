<script lang="ts">
    import {layers} from "./gameState.svelte.js";
    import Plasma from './plasma.svelte'
    import type {Matrix} from "./types";

    const {offset, matrix}: {offset: number, matrix: Matrix} = $props()
</script>

<div class="absolute">
    {#each layers.previousPlasma as plasma}
        <Plasma plasma={plasma} {matrix} {offset} />
    {/each}
</div>