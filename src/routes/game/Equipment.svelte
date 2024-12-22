<script lang="ts">
    import {equipment} from "./gameState.svelte";
    import Badge from "./Badge.svelte";
    import type {EquipmentItem} from "./types";
    import {mapColorsToHex} from "./constants";

    const getColor = (kind: EquipmentItem) => {
        return mapColorsToHex[kind.color];
    }
</script>

<div class="flex gap-x-6 w-fit h-20">
    {#each Object.values(equipment) as kind}
        <div class="relative w-24">
            <div>
                <img class="" src={kind.image} alt={kind.type}>
            </div>
            <Badge left={0} top={-6} count={kind.count} color={kind.color}/>
            <button class="absolute bg-violet-200 text-stone-900 rounded-lg w-20 top-11 left-0 text-base cursor-pointer"
                    style:box-shadow={`0 0 2px 2px ${getColor(kind)}`}
                    disabled={kind.count < 1}
                    onclick={() => kind.handler()}
            >
                <span class="mt-1 inline-block">Use [{kind.key}]</span>
            </button>
        </div>
    {/each}
</div>

<style>

</style>