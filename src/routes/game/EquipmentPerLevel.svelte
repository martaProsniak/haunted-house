<script lang="ts">
    import { equipmentThisLevel} from "./gameState.svelte.js";
    import Badge from "./Badge.svelte";
</script>

<div class="h-14 flex gap-x-6 w-fit items-center">
    {#each Object.values(equipmentThisLevel) as kind}
        <div class="relative">
            <div>
                <img class="w-full" src={kind.image} alt={kind.type}>
            </div>
            <Badge left={48} count={kind.count} color={kind.color}/>
        </div>
    {/each}
</div>