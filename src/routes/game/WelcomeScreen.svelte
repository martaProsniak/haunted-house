<script lang="ts">
    import {fade} from "svelte/transition";
    import {onMount} from "svelte";
    import {startGame} from "./gameState.helpers.svelte.js";
    import {gameStatus} from "./gameState.svelte";

    let open = $state(false);

    onMount(() => {
        if ($gameStatus !== 'not-started') return;
        open = true;
    })

    const handleStartGame = () => {
        open = false;
        startGame();
    }

</script>

{#if open}
    <main transition:fade={{duration: 500}}
          class="py-8 px-16 semi-transparent w-5-6 md:w-1/2 max-h-full overflow-y-scroll rounded-lg space-y-8 text-2xl">
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
        <div class="w-full text-center font-luckiest">
            <button class="px-4 py-3 bg-pink-500 rounded-lg text-xl" onclick={handleStartGame}>Enter house</button>
        </div>
    </main>
{/if}

<style>
    .semi-transparent {
        background-color: rgba(11, 7, 22, 0.75);
    }

    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(11, 7, 22, 0.75);
    }

    ::-webkit-scrollbar-thumb {
        background-color: black;
        border-radius: 10px;
        border: 3px solid rgba(11, 7, 22, 0.75);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: black;
    }

    main {
        scrollbar-width: thin;
        scrollbar-color: black rgba(11, 7, 22, 0.75);
    }
</style>