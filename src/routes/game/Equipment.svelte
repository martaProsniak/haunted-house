<script lang="ts">
    import {equipment} from "./gameState.svelte";
    import Badge from "./Badge.svelte";
    import type {EquipmentItem} from "./types";
    import {mapColorsToHex} from "./constants";

    const getColor = (kind: EquipmentItem) => {
        return mapColorsToHex[kind.color];
    }
</script>

<div class="flex gap-x-6 w-fit h-16">
    {#each Object.values(equipment) as kind}
        <div class="relative w-24">
            <div>
                <img class="" src={kind.image} alt={kind.type}>
            </div>
            <Badge left={-4} top={-6} count={kind.count} color={kind.color}/>
            <button class="absolute font-dynaPuff  bg-violet-200 text-stone-900 rounded-lg w-16 top-8 left-8 text-sm cursor-pointer py-1"
                    style:box-shadow={`0 0 2px 2px ${getColor(kind)}`}
                    class:scale={kind.count > 0}
                    disabled={kind.count < 1}
                    onclick={() => kind.handler()}
            >
                Use [{kind.key.toLowerCase()}]
            </button>
        </div>
    {/each}
</div>

<style>
    @keyframes scale {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .scale {
        animation-name: scale;
        animation-duration: 1s;
        animation-iteration-count: infinite;
    }
</style>