<script lang="ts">
    import {equipment} from "./gameState.svelte";
    import Badge from "./Badge.svelte";
    import type {EquipmentItem} from "./types";
    import {mapColorsToHex} from "./constants";

    const getColor = (kind: EquipmentItem) => {
        return mapColorsToHex[kind.color];
    }
</script>

<div class="flex gap-x-12 w-fit h-16">
    {#each Object.values(equipment) as kind}
        <div class="relative w-24">
            <div>
                <img class="" src={kind.image} alt={kind.type}>
            </div>
            <Badge left={-4} top={28} count={kind.count} color={kind.color}/>
            <button class="absolute font-dynaPuff  bg-violet-200 text-black rounded-lg w-16 top-8 left-11 text-sm cursor-pointer py-1 enabled:hover:bg-violet-500 transition-colors"
                    style:box-shadow={`0 0 2px 2px ${getColor(kind)}`}
                    class:bounce={kind.count > 0}
                    disabled={kind.count < 1}
                    onclick={() => kind.handler()}
            >
                Use [{kind.key.toLowerCase()}]
            </button>
        </div>
    {/each}
</div>

<style>


    @keyframes bounce {
        0%, 100% {
            transform: translateY(-12.5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
    }

    .bounce {
        animation: bounce 1s infinite;
    }
</style>