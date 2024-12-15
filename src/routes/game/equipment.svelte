<script lang="ts">
    import {equipment} from "./gameState.svelte";
    import Badge from "./badge.svelte";
    import {nextPlasmaColors} from "./gameState.svelte";
    import type {SpecialColor} from "./types";

    const handleClick = (type: SpecialColor) => {
        nextPlasmaColors.current = type;
        nextPlasmaColors.derived = type;
    }
</script>

<div class="flex gap-x-6 w-fit items-center relative">
    {#each $equipment as kind}
        <button class="" onclick={() => handleClick(kind.type)}>
            <img class="w-full" src={kind.image} alt={kind.type}>
        </button>
        <Badge count={kind.count} color={kind.color}/>
    {/each}
</div>

<style>

</style>