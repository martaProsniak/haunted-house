<script lang="ts">
    import {layers} from "./gameState.svelte";
    import NextPlasma from "./nextPlasma.svelte";
    import GhostsPerColor from "./ghostsPerColor.svelte";
    import Score from './score.svelte'
    import Level from "./level.svelte";
    import EquipmentDisplay from './equipment.svelte'
</script>

<div class="space-y-8 text-xl font-luckiest tracking-wide text-violet-200  px-6 rounded-lg shadow-sm">
    <NextPlasma />
    <Score />
    <div class="space-y-2">
        <p>Equipment:</p>
        <EquipmentDisplay />
    </div>
    <div class="space-y-2">
        <p>Catch ghosts:</p>
        <GhostsPerColor ghosts={layers.catchGhosts} />
    </div>
    <div class="space-y-2">
        <p>Escaped ghosts:</p>
        <GhostsPerColor ghosts={layers.escapedGhosts} />
    </div>
    <Level />
</div>