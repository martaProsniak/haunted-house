<script lang="ts">
    import {layers} from "./gameState.svelte";
    import NextPlasma from "./nextPlasma.svelte";
    import GhostsPerColor from "./ghostsPerColor.svelte";
</script>

<div class="space-y-8">
    <NextPlasma />
    <GhostsPerColor ghosts={layers.catchGhosts} label="Catch ghosts" />
    <GhostsPerColor ghosts={layers.escapedGhosts} label="Escaped Ghosts" />
</div>