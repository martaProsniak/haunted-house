<script lang="ts">
    import {matrix} from "./game.state.svelte";
</script>

{#each matrix as row, rowIndex}
    <div class="w-fit flex flex-row flex-nowrap gap-1">
        {#each row as cell, cellIndex}
            <div class="cell"></div>
        {/each}
    </div>
{/each}

<style>
    .cell {
        width: 40px;
        height: 40px;
        border: 2px #371d53 solid;
        box-sizing: border-box;
        color: white;
        font-size: 12px;
    }
</style>