<script lang="ts">
    import {gameStatus, level, score, totalScore} from "./gameState.svelte.js";
    import {fade} from "svelte/transition";

    let open = $derived($gameStatus === 'success' || $gameStatus === 'failure');

    const onclick = () => {
        if ($gameStatus === 'success') {
            $level++;
        }
        $gameStatus = 'started';
    }
</script>

{#snippet success()}
    <div class="space-y-8">
        <div class="space-y-2">
            <p>Job well done!</p>
            <p>You completed {$level}. level!</p>
        </div>
        <div class="space-y-2">
            <p>Points: {$score}</p>
            {#if $totalScore}
                <p>Total score: {$totalScore}</p>
            {/if}
        </div>

        <button {onclick}>Start next level</button>
    </div>
{/snippet}

{#snippet failure()}
    <div>
        <p>You lost!</p>
        <button {onclick}>Restart level {$level}</button>
    </div>
{/snippet}

{#if open}
    <dialog class="w-1/2 max-w-full bg-stone-900" open in:fade={{duration: 200}} out:fade={{duration: 100}}>
        <div class="p-8 text-2xl text-center text-yellow-50">
            {#if $gameStatus === 'success'}
                {@render success()}
            {/if}
            {#if $gameStatus === 'failure'}
                {@render failure()}
            {/if}</div>
    </dialog>
{/if}

<style>
    dialog {
        z-index: 20;
        border: 4px black solid;
        border-radius: 8px;
    }
</style>