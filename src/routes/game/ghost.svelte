<script lang="ts">
    import {
        lastCol,
        currentRow,
        currentCol,
        rotation,
        derivedRow,
        derivedCol,
        lastRow,
        layers
    } from "./gameState.svelte.js";
    import {fade, scale} from 'svelte/transition'
    import type {Ghost} from "./types";
    import {ghostsImages, ghostsImagesGlued} from "./utils";
    interface Props {
        ghost: Ghost,
        offset: number,
    }
    const {ghost, offset}: Props = $props();

    const mapGhostsToBgColors = {
        pink: '#ec3597',
        green: '#45e732',
        blue: '#2398ec',
    }

    let neighbors = $derived.by(() => {
        return {
            top: ghost.row === 0 ? null : layers.matrix[ghost.row - 1][ghost.column],
            right: ghost.column === lastCol ? null : layers.matrix[ghost.row][ghost.column + 1],
            bottom: ghost.row === lastRow ? null : layers.matrix[ghost.row + 1][ghost.column],
            left: ghost.row === 0 ? null : layers.matrix[ghost.row][ghost.column - 1],
        }
    })

    let isGlued = $derived.by(() => {
        return Object.values(neighbors).some((neighbour) => (neighbour?.color === ghost.color && neighbour.type === 'plasma'))
    })

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
        ghost.neighbors = neighbors;
        ghost.hasPillAbove = hasPillAbove
    })
</script>

<div
        class="ghost"
        style:background-image={`url("${ghost.imageUrl}")`}
        style:top={`${ghost.row * offset}px`}
        style:left={`${ghost.column * offset}px`}
        style:box-shadow={ghost.isGlued ? `0 0 0 1px ${mapGhostsToBgColors[ghost.color]}` : ''}
        style:background-color={ghost.isGlued ? `${mapGhostsToBgColors[ghost.color]}` : `${mapGhostsToBgColors[ghost.color]}` + '55'}
        in:scale={{duration: 200}} out:scale={{duration: 100}}
></div>

<style>
    .ghost {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        border-radius: 4px;
        transition: background-color ease 0.2s;
    }
</style>