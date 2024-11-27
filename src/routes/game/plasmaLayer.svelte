<script lang="ts">
    import {layers} from "./game.state.svelte";
    import Plasma from './plasma.svelte'

    const {offset} = $props();
</script>

<div class="absolute">
    {#each layers.previousPlasma as plasma}
        <Plasma {...plasma} {offset} />
    {/each}
</div>