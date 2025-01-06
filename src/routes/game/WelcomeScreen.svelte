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
        <div class="w-full text-center">
            <button class="px-4 py-2 rounded-lg text-2xl" onclick={handleStartGame}>
                <span class="shadow text-3xl font-bold">Enter house</span>
            </button>
        </div>
    </main>
{/if}