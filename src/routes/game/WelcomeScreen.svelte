<script lang="ts">
    import {fade} from "svelte/transition";
    import {onDestroy, onMount} from "svelte";
    import {startGame} from "./gameState.helpers.svelte.js";
    import {gameStatus, volume} from "./gameState.svelte";
    import intro from '$lib/assets/intro.mp3';
    import {GameAudio} from "./GameAudio.svelte.js";

    let open = $state(false);
    let audio: GameAudio;

    onMount(() => {
        if ($gameStatus !== 'not-started') return;
        open = true;
        audio = new GameAudio(intro);
        audio.start();
    })

    $effect(() => {
        audio.setVolume($volume);
    })

    const handleStartGame = () => {
        open = false;
        audio?.reset();
        startGame();
    }

    onDestroy(() => {
        audio?.reset();
    })

</script>

{#if open}
    <main transition:fade={{duration: 500}}
          class="p-8 bg-semi-transparent rounded-lg space-y-8 text-base md:text-lg">
        <div class="space-y-2 text-center">
            <p>Haunted house, haunted walls</p>
            <p>They know lot of stories</p>
            <p>Haunted screams, haunted howls</p>
            <p>Wandering through the hills</p>
        </div>
        <div class="space-y-2 text-center">
            <p>If you dare, step right there</p>
            <p>Earn eternal glory</p>
            <p>In the night, start the fight</p>
            <p>Feel the eerie thrills!</p>
        </div>
        <div class="w-full text-center">
            <button class="px-4 py-2 rounded-lg text-2xl" onclick={handleStartGame}>
                <span class="text-spooky text-3xl font-bold">Enter</span>
            </button>
        </div>
    </main>
{/if}

<style>
    main {
        position: fixed;
        inset: 0;
        margin: auto;
        height: fit-content;
        width: fit-content;
    }
</style>