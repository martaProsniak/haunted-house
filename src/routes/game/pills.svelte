<script lang="ts">
    import {layers} from "./game.state.svelte";
    import Pill from './pill.svelte'

    const {offset} = $props();
</script>

<div class="absolute">
    {#each layers.previousPills as pill}
        <Pill {...pill} {offset} />
    {/each}
</div>