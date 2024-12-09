<script lang="ts">
    import {layers} from "./gameState.svelte";
    import {fade} from 'svelte/transition'
    import {mapColorsToHex} from "./constants";

    const {offset} = $props();

    $effect(() => {
        Object.keys(layers.removedItems).forEach((key) => {
            setTimeout(() => {
                delete layers.removedItems[key];
            }, 500)
        })
    })
</script>

<div class="absolute">
    {#each Object.values(layers.removedItems) as removedItems}
        {#each removedItems as item}
            <div
                    style:background-image={`url("${item.imageUrl}")`}
                    style:top={`${item.row * offset}px`}
                    style:left={`${item.column * offset}px`}
                    style:box-shadow={`0 0 0 1px ${mapColorsToHex[item.color]}`}
                    class="item-removed"
                    out:fade={{ duration: 100}} in:fade={{duration: 100}}>
            </div>
        {/each}
    {/each}
</div>

<style>
    .item-removed {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 20;
        box-sizing: border-box;
        font-size: 12px;
        border-radius: 4px;
        transition: box-shadow .2s ease-in-out;
    }
</style>