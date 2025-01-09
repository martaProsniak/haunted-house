<script lang="ts">
    import {
        currentCol,
        currentRow,
        derivedCol,
        derivedRow,
        lastCol,
        lastRow,
        layers,
        rotation
    } from "./gameState.svelte.js";
    import type {Ghost} from "./types";
    import {ghostsImages, ghostsImagesGlued, mapColorsToHex} from "./constants";

    interface Props {
        ghost: Ghost,
        offset: number,
    }
    const {ghost, offset}: Props = $props();

    let neighbors = $derived.by(() => {
        return {
            top: ghost.row === 0 ? null : layers.matrix[ghost.row - 1][ghost.column],
            right: ghost.column === lastCol ? null : layers.matrix[ghost.row][ghost.column + 1],
            bottom: ghost.row === lastRow ? null : layers.matrix[ghost.row + 1][ghost.column],
            left: ghost.row === 0 ? null : layers.matrix[ghost.row][ghost.column - 1],
        }
    })

    let isGlued = $derived.by(() => {
        return Object.values(neighbors).some((neighbour) => ((neighbour?.color === ghost.color && neighbour.type === 'plasma') || neighbour?.color === 'rainbow'))
    })

    let willMove = $derived(ghost.imageUrl.endsWith('gif'));

    let hasPillAbove = $derived.by(() => {
        if ($rotation === 270) {
            return ghost.row - 1 === $currentRow && (ghost.column === $currentCol);
        }
        if ($rotation === 90) {
            return ghost.row - 1 === $derivedRow && (ghost.column === $derivedCol);
        }
        return ghost.row - 1 === $currentRow && (ghost.column === $currentCol || ghost.column === $derivedCol);
    })

    $effect(() => {
        ghost.isGlued = isGlued;
        if (isGlued) {
            ghost.imageUrl = ghostsImagesGlued[ghost.color];
        } else {
            ghost.imageUrl = ghostsImages[ghost.color]
        }
    })

    $effect(() => {
        ghost.neighbors = neighbors;
    })

    $effect(() => {
        ghost.hasPillAbove = hasPillAbove
    })
</script>

<div
        class="ghost"
        style:background-image={`url("${ghost.imageUrl}")`}
        style:top={`${ghost.row * offset}px`}
        style:left={`${ghost.column * offset}px`}
        style:box-shadow={ghost.isGlued || willMove ? `0 0 0 1px ${mapColorsToHex[ghost.color]}` : ''}
        style:background-color={ghost.isGlued ? `${mapColorsToHex[ghost.color]}` : `${mapColorsToHex[ghost.color]}` + '55'}
></div>

<style>
    .ghost {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        border-radius: 4px;
        transition: all ease-in-out 0.1s;
    }
</style>