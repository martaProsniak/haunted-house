<script lang="ts">
    import {layers} from "./gameState.svelte";
    import RemovedItem from "./RemovedItem.svelte";

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
    {#each Object.keys(layers.removedItems) as group (group)}
        {#each layers.removedItems[group] as item}
            <RemovedItem {offset} {item} handleRemove={() => deleteKey(group)} />
        {/each}
    {/each}
</div>