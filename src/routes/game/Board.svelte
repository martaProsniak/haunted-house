<script lang="ts">
    import {lastCol, lastRow, layers} from "./gameState.svelte.js";
    import floorImage from '$lib/assets/floor.png';
    import candleImage from '$lib/assets/candle.png'
    import pumpkinImage from '$lib/assets/pumpkin.png';
    import webImage from '$lib/assets/web.png';
    import PauseModal from "./PauseModal.svelte";

    const getCellBgImg = (row:number, col: number) => {
        if ((row === 0 || row === lastRow) && (col === 0 || col === lastCol)) {
            return webImage;
        }
        if ((row === 3 ) && (col === 0 || col === lastCol)) {
            return candleImage;
        }
        if ((row === lastRow ) && (col === 1 || col === lastCol - 1)) {
            return pumpkinImage;
        }
        return floorImage;
    }
</script>

{#each layers.matrix as row, rowIndex}
    <div class="w-fit flex flex-row flex-nowrap gap-1">
        {#each row as cell, cellIndex}
            <div class="cell" style:background-image={`url("${getCellBgImg(rowIndex, cellIndex)}")`}>
            </div>
        {/each}
    </div>
{/each}
<PauseModal />


<style>
    .cell {
        width: 40px;
        height: 40px;
        box-sizing: border-box;
        color: white;
        font-size: 12px;
        opacity: 0.5;
    }
</style>