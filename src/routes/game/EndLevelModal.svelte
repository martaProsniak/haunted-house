<script lang="ts">
    import {gameStatus, level, lives, initialLives} from "./gameState.svelte.js";
    import {restartLevel} from "./gameState.helpers.svelte";
    import {fly} from "svelte/transition";
    import EquipmentPerLevel from "./EquipmentPerLevel.svelte";
    import Button from "$lib/components/Button.svelte";

    let open = $derived($gameStatus === 'success' || $gameStatus === 'failure');

    const onclick = () => {
        if ($gameStatus === 'success') {
            $level++;
            $gameStatus = 'started';
        }
        if ($gameStatus === 'failure') {
            restartLevel()
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            onclick();
        }
    }
</script>

{#snippet success()}
    <div class="space-y-12 px-14 w-full text-center">
        <div class="space-y-4">
            <p>Job well done!</p>
            <p>You cleared {$level}. floor!</p>
        </div>
        <div class="">
            <span>Nice! Ghosts dropped something!</span>
            <div class="mx-auto w-fit">
                <EquipmentPerLevel />
            </div>
        </div>

        <Button {onclick}>
            Next floor [ enter ]
        </Button>
    </div>
{/snippet}

{#snippet failure()}
    <div class="space-y-12 px-14 w-full text-center">
        <p>You lost!</p>
        <Button {onclick} classes="font-creepster">
            Restart [ enter ]
        </Button>
    </div>
{/snippet}

<svelte:document on:keydown={handleKeyDown}></svelte:document>

{#if open}
    <dialog class="p-6 text-violet-200 bg-stone-950 w-full h-full flex items-center text-xl" {open} in:fly={{duration: 500, y: -200, delay: 600}} out:fly={{duration: 500, y: -200, delay: 200}}>
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