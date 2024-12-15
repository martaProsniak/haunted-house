<script lang="ts">
    import {equipment} from "./gameState.svelte";
    import Badge from "./badge.svelte";
    import {nextPlasmaColors} from "./gameState.svelte";
    import type {EquipmentItem} from "./types";

    const handleClick = ({type, count}: EquipmentItem) => {
        if (count === 0) return;
        nextPlasmaColors.current = type;
        nextPlasmaColors.derived = type;
        equipment[type].count--;
    }
</script>

<div class="flex gap-x-6 w-fit items-center relative">
    {#each Object.values(equipment) as kind}
        <button class="outline-violet-800" disabled={kind.count < 1} onclick={() => handleClick(kind)}>
            <img class="w-full" src={kind.image} alt={kind.type}>
        </button>
        <Badge count={kind.count} color={kind.color}/>
    {/each}
</div>

<style>
</style>