<script lang="ts">
    import {
        lastCol,
        lastRow,
        layers,
    } from "./gameState.svelte.js";
    import {scale} from 'svelte/transition'
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
        return Object.values(neighbors).some((neighbour) => (neighbour?.color === ghost.color && neighbour.type === 'plasma'))
    })

    $effect(() => {
        ghost.isGlued = isGlued;
        if (isGlued) {
            ghost.imageUrl = ghostsImagesGlued[ghost.color];
        } else {
            ghost.imageUrl = ghostsImages[ghost.color]
        }
        ghost.neighbors = neighbors;
    })
</script>

<div
        class="ghost"
        style:background-image={`url("${ghost.imageUrl}")`}
        style:top={`${ghost.row * offset}px`}
        style:left={`${ghost.column * offset}px`}
        style:box-shadow={ghost.isGlued ? `0 0 0 1px ${mapColorsToHex[ghost.color]}` : ''}
        style:background-color={ghost.isGlued ? `${mapColorsToHex[ghost.color]}` : `${mapColorsToHex[ghost.color]}` + '55'}
        in:scale={{duration: 100}} out:scale={{duration: 100}}
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