<script lang="ts">
    import {gameStatus, level, score, totalScore, layers} from "./gameState.svelte.js";
    import {fade} from "svelte/transition";
    import GhostsPerColor from "./ghostsPerColor.svelte";

    let open = $derived($gameStatus === 'success' || $gameStatus === 'failure');

    const onclick = () => {
        if ($gameStatus === 'success') {
            $level++;
        }
        $gameStatus = 'started';
    }
</script>

{#snippet success()}
    <div class="space-y-20 w-fit mx-auto text-center font-luckiest tracking-wide">
        <div class="space-y-4">
            <p>Job well done!</p>
            <p>You completed {$level}. level!</p>
        </div>
        <div class="space-y-2">
            <p>Points: {$score}</p>
            {#if $totalScore}
                <p>Total score: {$totalScore}</p>
            {/if}
        </div>
        <div class="flex items-center gap-x-4">
            <span>Catch ghosts:</span>
            <GhostsPerColor ghosts={layers.catchGhosts} />
        </div>
        <div class="flex items-center gap-x-4">
            <span>Escaped ghosts:</span>
            <GhostsPerColor ghosts={layers.escapedGhosts} />
        </div>

        <button class="p-4 bg-violet-900 rounded-lg " {onclick}>Start next level</button>
    </div>
{/snippet}

{#snippet failure()}
    <div class="space-y-20 w-fit mx-auto text-center font-creepster tracking-wide">
        <p>You lost!</p>
        <button class="p-4 bg-violet-900 rounded-lg w-52" {onclick}>Restart level {$level}</button>
    </div>
{/snippet}

{#if open}
    <dialog class="w-full py-20 px-32 text-2xl  text-yellow-50 bg-stone-900" open in:fade={{duration: 200}} out:fade={{duration: 100}}>
            {#if $gameStatus === 'success'}
                {@render success()}
            {/if}
            {#if $gameStatus === 'failure'}
                {@render failure()}
            {/if}
    </dialog>
{/if}

<style>
    dialog {
        z-index: 20;
        border: 4px black solid;
        border-radius: 8px;
    }
</style>