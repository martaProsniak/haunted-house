<script lang="ts">
    import {gameStatus, level, volume, maxLevel} from "./gameState.svelte.js";
    import {progressLevel, restartLevel, startNextGame} from "./gameState.helpers.svelte";
    import {fly} from "svelte/transition";
    import EquipmentPerLevel from "./EquipmentPerLevel.svelte";
    import Button from "$lib/components/Button.svelte";
    import win from '$lib/assets/win.mp3';
    import lose from "$lib/assets/lose.mp3";
    import {GameAudio} from "./GameAudio.svelte";
    import StairsIcon from "$lib/components/icons/StairsIcon.svelte";

    let open = $derived($gameStatus === 'success' || $gameStatus === 'failure');
    const initialVolume = 0.3;
    const winSound = new GameAudio(win, {maxVolume: initialVolume});
    const loseSound = new GameAudio(lose, {maxVolume: initialVolume});

    const playEndLevelSound = () => {
        if ($gameStatus === 'success') {
            winSound.start();
            return;
        }
        loseSound.start();
    }

    $effect(() => {
        if (!open) {
            return;
        }
        playEndLevelSound();
    })

    $effect(() => {
        winSound.setVolume($volume);
        loseSound.setVolume($volume);
    })

    const onclick = () => {
        if ($gameStatus === 'success' && $level === maxLevel) {
            startNextGame();
        }
        if ($gameStatus === 'success') {
            progressLevel();
            winSound.reset();
        }
        if ($gameStatus === 'failure') {
            restartLevel();
            loseSound.reset();
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            onclick();
        }
    }
</script>

{#snippet success()}
    <div class="space-y-12 px-4 w-full text-center">
        <div class="space-y-4">
            <p>Job well done!</p>
            <p>You cleared {$level}. floor!</p>
        </div>
        <div class="">
            <p>You found something!</p>
            <div class="mx-auto w-fit">
                <EquipmentPerLevel />
            </div>
        </div>

        <div class="px-4">
            <Button {onclick}>
                <div class="flex items-center justify-center w-full gap-x-2">
                    <StairsIcon />
                    <span>Next floor<br>[ enter ]</span>
                </div>
            </Button>
        </div>
    </div>
{/snippet}

{#snippet endGame()}
    <div class="space-y-12 px-4 w-full text-center">
        <div class="space-y-4">
            <p class="text-2xl text-shadow-ghost">Impressive! </p>
            <p>You've cleared the whole house!</p>
            <p class="space-y-2">
                <span>You are the</span>
                <span class="inline-block w-full text-shadow-ghost text-2xl">Master Ghost Catcher!</span>
            </p>
        </div>
        <div class="space-y-4">
            <p>There are other haunted houses in the neighbourhood.</p>
            <p>You can use your epic skills to clean them too!</p>
        </div>

        <div class="px-4">
            <Button {onclick}>
                Next house [ Enter ]
            </Button>
        </div>
    </div>
{/snippet}

{#snippet failure()}
    <div class="space-y-12 px-10 w-full text-center">
        <p>You lost!</p>
        <Button {onclick}>
            Restart [ Enter ]
        </Button>
    </div>
{/snippet}

<svelte:document on:keydown={handleKeyDown}></svelte:document>

{#if open}
    <dialog class="p-6 text-blue-200 bg-darkViolet w-full h-full flex items-center text-xl" {open} in:fly={{duration: 500, y: -200, delay: 600}} out:fly={{duration: 500, y: -200, delay: 200}}>
        {#if $gameStatus === 'success' && $level === maxLevel}
            {@render endGame()}
        {:else if $gameStatus === 'success'}
                {@render success()}
        {:else}
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