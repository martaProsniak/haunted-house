<script lang="ts">
    import type {Matrix, Plasma} from "./types";
    import { scale} from 'svelte/transition'
    import {currentRow, gameStatus, isPaused, lastCol, lastRow, layers, gameInterval} from "./gameState.svelte.js";
    import {checkResult, clearItems, matchColorHorizontal, matchColorVertical} from "./matchItems.helpers";

    interface Props {
        plasma: Plasma;
        offset: number;
        matrix: Matrix;
    }

    const {plasma, offset, matrix}: Props = $props();

    let interval: ReturnType<typeof setInterval>;

    let neighbors = $derived.by(() => {
        return {
            top: plasma.row === 0 ? null : matrix[plasma.row - 1][plasma.column],
            right: plasma.column === lastCol ? null : matrix[plasma.row][plasma.column + 1],
            bottom: plasma.row === lastRow ? null : matrix[plasma.row + 1][plasma.column],
            left: plasma.row === 0 ? null : matrix[plasma.row][plasma.column - 1],
        }
    })

    let canMoveDown = $derived.by(() => {
        if (plasma.row + 1 === $currentRow) return false;
        if (neighbors.bottom) return false;
        if (neighbors.left?.type === 'ghost' && neighbors.left?.color === plasma.color) return false;
        if (neighbors.right?.type === 'ghost' && neighbors.right?.color === plasma.color) return false;
        return true
    })

    const matchItems = () => {
        const matchingTop = matchColorVertical(plasma.row, plasma.column, matrix);
        const matchingHorizontal = matchColorHorizontal(plasma.row, plasma.column, matrix);

        clearItems(matchingTop);
        clearItems(matchingHorizontal);
        const result = checkResult();
        if (result) {
            $gameStatus = result;
        }
    }

    $effect(() => {
        if (!plasma) {
            return;
        }
        interval = setInterval(() => {
            if (plasma.row === lastRow) {
                clearInterval(interval);
                return;
            }
            if ($gameStatus !== 'playing') {
                return;
            }
            if ($isPaused) {
                return;
            }
            if (canMoveDown) {
                plasma.row++;
            }
        }, $gameInterval);

        return () => {
            clearInterval(interval);
        }
    })

    $effect(() => {
        if (Object.values(neighbors).some((neighbour) => Boolean(neighbour))) {
            matchItems();
        }
    })
</script>

<div
        style:background-image={`url("${plasma.imageUrl}")`}
        style:top={`${plasma.row * offset}px`}
        style:left={`${plasma.column * offset}px`}
        class="plasma-previous"
        out:scale={{ duration: 100}} in:scale={{duration: 100}}>
</div>

<style>
    .plasma-previous {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;
        border-radius: 4px;
    }
</style>