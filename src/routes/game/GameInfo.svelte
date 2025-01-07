<script lang="ts">
    import {layers} from "./gameState.svelte";
    import NextPlasma from "./NextBullet.svelte";
    import RemainingGhosts from "./RemainingGhosts.svelte";
    import Score from './Score.svelte'
    import Level from "./Level.svelte";
    import EquipmentDisplay from './Equipment.svelte'
    import Lives from "./Lives.svelte";
    import Header from "$lib/components/Header.svelte";
</script>

<div class="space-y-6 text-xl px-6 rounded-lg shadow-sm">
    <NextPlasma />
    <Score />
    <div class="space-y-3">
        <Header text="Equipment" />
        <EquipmentDisplay />
    </div>
    <div class="space-y-2">
        <Header text="Ghosts remaining" />
        <RemainingGhosts ghosts={layers.ghosts} />
    </div>
    <div class="space-y-2">
        <Header text="HP" />
        <Lives />
    </div>
    <Level />
</div>