<script lang="ts">
    const {matrix} = $props();
</script>

{#each matrix as row, rowIndex}
    <div class="w-fit flex flex-row flex-nowrap gap-1">
        {#each row as cell, cellIndex}
            <div class="cell">{rowIndex}, {cellIndex}</div>
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