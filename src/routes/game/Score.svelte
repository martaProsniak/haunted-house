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
    <div class="flex items-center gap-x-10">
        <div>
            <Header text="Score" />
            {#key $score}
                <p class="shadow">{Math.trunc($currentScore)}</p>
            {/key}
        </div>
        <div class="w-[4px] h-[4px] rounded-full inline-block bg-violet-200 border-none shadow-gradient-light"></div>
        <div>
            <Header text="Best" />
            {#key $score}
                <p class="shadow">{Math.trunc($currentScore)}</p>
            {/key}
        </div>
    </div>
</div>