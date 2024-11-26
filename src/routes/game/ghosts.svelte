<script lang="ts">
    const {offset, ghosts} = $props();
</script>

<div class="absolute">
    {#each ghosts as ghost}
        <div
                class="ghost"
                style:background-color={ghost.color}
                style:top={`${ghost.row * offset}px`}
                style:left={`${ghost.column * offset}px`}
        ></div>
    {/each}
</div>

<style>
    .ghost {
        border: 4px black solid;
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
    }
</style>