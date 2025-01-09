<script lang="ts">
    import {totalScore, bestScore} from "./gameState.svelte";
    import { tweened } from 'svelte/motion'
    import Header from "$lib/components/Header.svelte";

    let tweenedTotalScore = tweened($totalScore);
    let tweenedBestScore = tweened($bestScore);

    $effect(() => {
        tweenedTotalScore.set($totalScore);
    })

    $effect(() => {
        tweenedBestScore.set($bestScore);
    })
</script>

<div class="">
    <div class="flex items-center gap-x-24">
        <div>
            <Header text="Score" />
            {#key $totalScore}
                <p class="text-shadow-ghost">{Math.trunc($tweenedTotalScore)}</p>
            {/key}
        </div>
        <div>
            <Header text="Best" />
                <p class="text-shadow-ghost">{Math.trunc($tweenedBestScore)}</p>
        </div>
    </div>
</div>