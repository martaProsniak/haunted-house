<script lang="ts">
    import {layers} from "./gameState.svelte";
    import NextPlasma from "./NextBullet.svelte";
    import RemainingGhosts from "./RemainingGhosts.svelte";
    import Score from './Score.svelte'
    import Level from "./Level.svelte";
    import EquipmentDisplay from './Equipment.svelte'
    import Lives from "./Lives.svelte";
</script>

<div class="space-y-6 text-xl font-cherryBomb px-6 rounded-lg shadow-sm">
    <NextPlasma />
    <Score />
    <div class="space-y-3">
        <p>Equipment:</p>
        <EquipmentDisplay />
    </div>
    <div class="space-y-2">
        <p>Ghosts remaining:</p>
        <RemainingGhosts ghosts={layers.ghosts} />
    </div>
    <div class="space-y-2">
        <p>HP:</p>
        <Lives />
    </div>
    <Level />
</div>