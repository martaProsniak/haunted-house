<script lang="ts">
    import type {MatrixItem} from "./types";
    import {mapColorsToHex} from "./constants";
    import {scale} from 'svelte/transition'
    import explosionImage from "$lib/assets/explosion.gif";
    import {onMount} from "svelte";

    interface Props {
        item: MatrixItem | null;
        offset: number;
        handleRemove: () => void;
    }

    const {item, offset, handleRemove}: Props = $props();

    onMount(() => {
        if (!item?.isBombed) return;
        item.imageUrl = explosionImage;
    })


</script>

{#if item}
    <div
            style:background-image={`url("${item.imageUrl}")`}
            style:top={`${item.row * offset}px`}
            style:left={`${item.column * offset}px`}
            style:box-shadow={!item.isBombed ? `0 0 0 1px ${mapColorsToHex[item.color]}` : ''}
            style:opacity={!item.isBombed ? 0.4 : 0.8}
            class="item-removed transition-all"
            out:scale={{ duration: 200}}
            onoutroend={() => handleRemove() }
    >
    </div>
{/if}

<style>
    .item-removed {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 9;
        box-sizing: border-box;
        font-size: 12px;
        border-radius: 4px;
    }
</style>