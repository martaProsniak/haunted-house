<script lang="ts">
    import {gameStatus, level, score, totalScore, layers} from "./gameState.svelte.js";
    import {fade} from "svelte/transition";
    import GhostsPerColor from "./ghostsPerColor.svelte";
    import EquipmentPerLevel from "./equipmentPerLevel.svelte";

    let open = $derived($gameStatus === 'success' || $gameStatus === 'failure');

    const onclick = () => {
        if ($gameStatus === 'success') {
            $level++;
        }
        $gameStatus = 'started';
    }
</script>

{#snippet info()}
    <div class="space-y-4">
        <p>Points: {$score}</p>
        {#if $totalScore}
            <p>Total score: {$totalScore}</p>
        {/if}
    </div>
    <div class="flex items-center justify-start gap-x-4">
        <span class="w-52 text-right">Catch ghosts:</span>
        <GhostsPerColor ghosts={layers.catchGhosts}/>
    </div>
    <div class="flex items-center justify-start gap-x-4">
        <span class="w-52 text-right">Escaped ghosts:</span>
        <GhostsPerColor ghosts={layers.escapedGhosts}/>
    </div>
{/snippet}

{#snippet success()}
    <div class="space-y-10 w-fit mx-auto text-center font-luckiest tracking-wide text-2xl">
        <div class="space-y-4">
            <p>Job well done!</p>
            <p>You completed {$level}. level!</p>
        </div>
        {@render info()}
        <div class="flex items-center justify-start gap-x-4">
            <span class="w-52 text-right">Bonuses:</span>
            <EquipmentPerLevel />
        </div>

        <button class="p-4 bg-violet-900 rounded-lg" autofocus {onclick}>Start next level</button>
    </div>
{/snippet}

{#snippet failure()}
    <div class="space-y-20 w-fit mx-auto text-center font-creepster text-3xl">
        <p>You lost!</p>
        {@render info()}
        <button class="p-4 bg-violet-900 rounded-lg w-52" {onclick}>Restart level {$level}</button>
    </div>
{/snippet}

{#if open}
    <dialog class="w-8/12 py-20 px-32  text-violet-200 bg-stone-950" open in:fade={{duration: 200}}
            out:fade={{duration: 100}}>
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