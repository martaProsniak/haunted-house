<script lang="ts">
    import {layers} from "./gameState.svelte";
    import {scale} from 'svelte/transition'
    import {mapColorsToHex} from "./constants";

    const {offset} = $props();

    $effect(() => {
        Object.keys(layers.removedItems).forEach((key) => {
            setTimeout(() => {
                layers.removedItems[key] = layers.removedItems[key]?.map(() => null)
            }, 500)
        });
    });

    const deleteKey = (key: string) => {
        if (layers.removedItems[key]?.filter(Boolean).length) {
            return;
        }
        delete layers.removedItems[key];
    }
</script>

<div class="absolute">
    {#each Object.keys(layers.removedItems) as group}
        {#each layers.removedItems[group] as item}
            {#if item}
                <div
                        style:background-image={`url("${item.imageUrl}")`}
                        style:top={`${item.row * offset}px`}
                        style:left={`${item.column * offset}px`}
                        style:box-shadow={`0 0 0 1px ${mapColorsToHex[item.color]}`}
                        class="item-removed"
                        out:scale={{ duration: 200}}
                        onoutroend={() => deleteKey(group) }

                >
                </div>
            {/if}
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
    }
</style>