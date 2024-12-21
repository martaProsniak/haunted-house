<script lang="ts">
    import {gameStatus, level, score, totalScore, layers, lives, initialLives} from "./gameState.svelte.js";
    import {fly} from "svelte/transition";
    import GhostsPerColor from "./ghostsPerColor.svelte";
    import EquipmentPerLevel from "./equipmentPerLevel.svelte";
    import Lives from "./lives.svelte";

    let open = $derived($gameStatus === 'success' || $gameStatus === 'failure');

    const onclick = () => {
        if ($gameStatus === 'success') {
            $level++;
        }
        if ($gameStatus === 'failure') {
            $lives = initialLives;
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
        <span class="w-52 text-right">Lives:</span>
        <Lives />
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

        <button class="p-4 bg-violet-900 rounded-lg" {onclick}>Start next level</button>
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
    <dialog class="py-20 px-32  text-violet-200 bg-stone-950 w-10/12 " open transition:fly={{duration: 500, y: -200, delay: 200}}>
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
        z-index: 30;
        border: 4px black solid;
        border-radius: 8px;
    }
</style>