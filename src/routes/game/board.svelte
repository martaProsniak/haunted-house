<script lang="ts">
    import {lastCol, lastRow, layers} from "./gameState.svelte.js";
    import floorImage from '$lib/assets/floor.png';
    import candleImage from '$lib/assets/candle.png'
    import type {Matrix} from "./types";

    const {matrix}: { matrix: Matrix } = $props();

    const getCellBgImg = (row:number, col: number) => {
        if ((row === 0 || row === lastRow) && (col === 0 || col === lastCol)) {
            return candleImage;
        }
        return floorImage;
    }
</script>

{#each matrix as row, rowIndex}
    <div class="w-fit flex flex-row flex-nowrap gap-1">
        {#each row as cell, cellIndex}
            <div class="cell" style:background-image={`url("${getCellBgImg(rowIndex, cellIndex)}")`}>
                {matrix[rowIndex][cellIndex]?.type === 'ghost' ? 'G' : matrix[rowIndex][cellIndex]?.type === 'plasma' ? 'P' : ''}
            </div>
        {/each}
    </div>
{/each}

<style>
    .cell {
        width: 40px;
        height: 40px;
        box-sizing: border-box;
        color: white;
        font-size: 12px;
    }
</style>