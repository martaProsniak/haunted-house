<script lang="ts">
    import {score} from "./gameState.svelte";
    import { tweened } from 'svelte/motion'

    let currentScore = tweened($score)

    $effect(() => {
        currentScore.set($score);
    })
</script>

<div class="">
    <div>Score
        {#key $score}
            <p>{Math.trunc($currentScore)}</p>
        {/key}
    </div>
</div>