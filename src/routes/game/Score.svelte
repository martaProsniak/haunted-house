<script lang="ts">
    import {score} from "./gameState.svelte";
    import { tweened } from 'svelte/motion'
    import Header from "$lib/components/Header.svelte";

    let currentScore = tweened($score)

    $effect(() => {
        currentScore.set($score);
    })
</script>

<div class="">
    <div>
        <Header text="Score" />
        {#key $score}
            <p>{Math.trunc($currentScore)}</p>
        {/key}
    </div>
</div>