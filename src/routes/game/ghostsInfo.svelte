<script lang="ts">
    import {layers} from "./game.state.svelte";
</script>

<div>
    <span>Catch ghosts</span>
    {#each Object.keys(layers.catchGhosts) as color}
        {#if layers.catchGhosts[color] > 0}
            <div>{color}:{layers.catchGhosts[color]}</div>
        {/if}
    {/each}
</div>

<div>
    <span>Escaped ghosts</span>
    {#each Object.keys(layers.escapedGhosts) as color}
        {#if layers.escapedGhosts[color] > 0}
            <div>{color}:{layers.escapedGhosts[color]}</div>
        {/if}
    {/each}
</div>