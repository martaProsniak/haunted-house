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
          class="p-16 semi-transparent max-h-full rounded-lg space-y-8 text-xl">
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
        <div class="w-full text-center font-creepster">
            <button class="px-4 py-2 rounded-lg text-3xl" onclick={handleStartGame}>
                <span class="shadow">Enter house</span>
            </button>
        </div>
    </main>
{/if}

<style>
    .semi-transparent {
        background-color: rgba(11, 7, 22, 0.75);
    }

    .shadow {
        text-shadow: 0 2px 0.1em #ec3597, 0 2px 0.2em #2398ec, 0 0 0.1em #45e732;
    }
</style>