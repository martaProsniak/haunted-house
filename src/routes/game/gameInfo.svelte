<script lang="ts">
    import {layers} from "./gameState.svelte";
    import NextPlasma from "./nextPlasma.svelte";
    import GhostsPerColor from "./ghostsPerColor.svelte";
    import Score from './score.svelte'
    import Level from "./level.svelte";
</script>

<div class="space-y-12 text-xl font-luckiest tracking-wide h-full">
    <NextPlasma />
    <Score />
    <div class="">
        <p>Catch ghosts:</p>
        <GhostsPerColor ghosts={layers.catchGhosts} />
    </div>
    <div>
        <p>Escaped ghosts:</p>
        <GhostsPerColor ghosts={layers.escapedGhosts} />
    </div>
    <Level />
</div>