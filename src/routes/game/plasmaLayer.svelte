<script lang="ts">
    import {layers} from "./gameState.svelte.js";
    import Plasma from './plasma.svelte'

    const {offset} = $props();
</script>

<div class="absolute">
    {#each layers.previousPlasma as plasma (plasma.id)}
        <Plasma plasma={plasma} {offset} />
    {/each}
</div>