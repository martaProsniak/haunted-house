<script lang="ts">
    import type { Plasma} from "./types";
    import { scale} from 'svelte/transition'
    import {currentRow, gameStatus, isPaused, lastCol, lastRow, layers} from "./gameState.svelte";
    import {checkResult, clearItems, matchColorHorizontal, matchColorVertical} from "./matchItems.helpers";

    interface Props {
        plasma: Plasma;
        offset: number;
    }

    const {plasma, offset}: Props = $props();

    let animationFrame: number;
    let lastTime: number | null = null;
    const moveInterval = 50;
    let isRainbow = $derived(plasma.color === 'rainbow');

    let neighbors = $derived.by(() => {
        return {
            top: plasma.row === 0 ? null : layers.matrix[plasma.row - 1][plasma.column],
            right: plasma.column === lastCol ? null : layers.matrix[plasma.row][plasma.column + 1],
            bottom: plasma.row === lastRow ? null : layers.matrix[plasma.row + 1][plasma.column],
            left: plasma.row === 0 ? null : layers.matrix[plasma.row][plasma.column - 1],
        }
    })

    let canMoveDown = $derived.by(() => {
        if (plasma.row + 1 === $currentRow) return false;
        if (neighbors.bottom) return false;
        if (isRainbow) return !(Object.values(neighbors).some((neighbor) => neighbor?.type === 'ghost'))
        return !(Object.values(neighbors).some((neighbor) => neighbor?.type === 'ghost' && neighbor?.color === plasma.color));
    })

    const matchItems = () => {
        const matchingTop = matchColorVertical(plasma.row, plasma.column);
        const matchingHorizontal = matchColorHorizontal(plasma.row, plasma.column);

        clearItems(matchingTop);
        clearItems(matchingHorizontal);
        const result = checkResult();
        if (result) {
            $gameStatus = result;
        }
    }

    const animatePlasma = (timestamp: number) => {
        if (!plasma || $gameStatus !== 'playing' || $isPaused) {
            animationFrame = requestAnimationFrame(animatePlasma);
            return;
        }

        if (lastTime === null) {
            lastTime = timestamp;
        }

        const delta = timestamp - lastTime;

        if (delta >= moveInterval) {
            if (plasma.row === lastRow || plasma.toBeRemoved) {
                cancelAnimationFrame(animationFrame);
                return;
            }

            if (canMoveDown) {
                layers.matrix[plasma.row][plasma.column] = null;
                plasma.row++;
                layers.matrix[plasma.row][plasma.column] = plasma;
                matchItems();
            }

            lastTime = timestamp;
        }

        animationFrame = requestAnimationFrame(animatePlasma);
    }

    $effect(() => {
        if (!plasma) {
            return;
        }

        lastTime = null;
        animationFrame = requestAnimationFrame(animatePlasma);

        return () => {
            cancelAnimationFrame(animationFrame);
            lastTime = null;
        };
    });

</script>

<div
        style:background-image={`url("${plasma.imageUrl}")`}
        style:top={`${plasma.row * offset}px`}
        style:left={`${plasma.column * offset}px`}
        class="plasma-previous"
        out:scale={{ duration: 200}} in:scale={{duration: 100}}>
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
        transition: all ease-in-out 0.1s;
    }
</style>