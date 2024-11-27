<script lang="ts">
    import {layers} from "./game.state.svelte";
    import Ghost from './ghost.svelte'
    const {offset, derivedRow, derivedCol} = $props();
</script>

<div class="absolute">
    {#each layers.ghosts as ghost}
        <Ghost {ghost} {offset} {derivedCol} {derivedRow} />
    {/each}
</div>
