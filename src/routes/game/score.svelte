<script lang="ts">
    import {score, totalScore} from "./game.state.svelte";
</script>

<div>Level score: {$score}</div>
<div>Total score: {$totalScore}</div>