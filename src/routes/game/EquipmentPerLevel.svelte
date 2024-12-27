<script lang="ts">
    import {equipmentThisLevel} from "./gameState.svelte.js";
    import Badge from "./Badge.svelte";
</script>

<div class="h-14 flex gap-x-6 w-fit items-center">
    {#each Object.values(equipmentThisLevel) as kind}
        {#if kind.count > 0}
            <div class="relative">
                <div>
                    <img class="w-full h-8" src={kind.image} alt={kind.type}>
                </div>
                <Badge left={40} top={12} count={kind.count} color={kind.color}/>
            </div>
        {/if}
    {/each}
</div>