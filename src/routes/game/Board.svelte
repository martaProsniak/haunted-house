<script lang="ts">
    import {lastCol, lastRow, layers} from "./gameState.svelte.js";
    import candleImage from '$lib/assets/candle.gif'
    import pumpkinImage from '$lib/assets/pumpkin.gif';
    import webImage from '$lib/assets/web.png';
    import spiderGif from '$lib/assets/spider.gif';
    import spiderGifSlow from '$lib/assets/spider-slow.gif';

    const getCellBgImg = (row:number, col: number) => {
        if ((row === 0 && col === 0) || (row === lastRow && col === lastCol)) {
            return webImage;
        }
        if (row === lastRow && col === 0 ) {
            return spiderGifSlow;
        }
        if (row === 0 && col === lastCol ) {
            return spiderGif;
        }
        if ((row === 3 ) && (col === 0 || col === lastCol)) {
            return candleImage;
        }
        if ((row === lastRow ) && (col === 1 || col === lastCol - 1)) {
            return pumpkinImage;
        }
        return '';
    }
</script>

{#each layers.matrix as row, rowIndex}
    <div class="w-fit flex flex-row flex-nowrap gap-1">
        {#each row as cell, cellIndex}
            <div class="cell"
                 style:background-image={`url("${getCellBgImg(rowIndex, cellIndex)}")`}
                style:transform={rowIndex === 0 && cellIndex === lastCol ? 'rotate(180deg)' : ''}
            >
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
        opacity: 1;
        background: var(--color-dark)
    }
</style>