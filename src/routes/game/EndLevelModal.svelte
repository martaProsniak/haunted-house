<script lang="ts">
    import {gameStatus, level, lives, initialLives} from "./gameState.svelte.js";
    import {fly} from "svelte/transition";
    import EquipmentPerLevel from "./EquipmentPerLevel.svelte";

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

{#snippet success()}
    <div class="space-y-12 w-fit mx-auto text-center text-2xl">
        <div class="space-y-4">
            <p>Job well done!</p>
            <p>You cleared {$level}. floor!</p>
        </div>
        <div class=" gap-x-4 ">
            <span>You found special bullet!</span>
            <div class="mx-auto w-fit">
                <EquipmentPerLevel />
            </div>
        </div>

        <button class="px-4 py-3 bg-violet-900 rounded-lg font-cherryBomb" {onclick}>Next floor</button>
    </div>
{/snippet}

{#snippet failure()}
    <div class="space-y-12 w-fit mx-auto text-center text-2xl">
        <p>You lost!</p>
        <button class="px-4 py-3 bg-violet-900 rounded-lg font-creepster" {onclick}>Restart floor {$level}</button>
    </div>
{/snippet}

{#if open}
    <dialog class="p-6 text-violet-200 bg-stone-950 w-full h-full flex items-center" {open} in:fly={{duration: 500, y: -200, delay: 600}} out:fly={{duration: 500, y: -200, delay: 200}}>
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
        z-index: 40;
        border: 4px black solid;
        border-radius: 8px;
    }
</style>