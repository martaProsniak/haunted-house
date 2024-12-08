<script lang="ts">
    import {score, totalScore} from "./gameState.svelte.js";
</script>

<div>Level score: {$score}</div>
{#if $totalScore > 0}
    <div>Total score: {$totalScore}</div>
{/if}