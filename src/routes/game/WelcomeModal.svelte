<script lang="ts">
    import {fly} from "svelte/transition";
    import {onMount} from "svelte";
    import {startGame} from "./gameState.helpers.svelte.js";
    import {gameStatus} from "./gameState.svelte";

    let visible = $state(false);

    onMount(() => {
        if ($gameStatus !== 'not-started') return;
        visible = true;
    })

    const handleStartGame = () => {
        visible = false;
        startGame();
    }

</script>

{#if visible}
    <dialog transition:fly={{duration: 500, y: -200}}
            class="w-10/12 max-w-[1200px] bg-black text-white text-center text-2xl rounded-lg p-10 space-y-4 z-30" open>
        <p>Hello, ghostbuster apprentice!</p>
        <p>Lorem ipsum</p>
        <button class="p-4 bg-pink-500 rounded-lg w-52" onclick={handleStartGame}>Start new game</button>
    </dialog>
{/if}

<style>

</style>