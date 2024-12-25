<script lang="ts">
    import {fly} from "svelte/transition";
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
    <dialog transition:fly={{duration: 500, y: -200}}
            class="w-10/12 max-w-[1200px] semi-transparent text-white text-xl rounded-lg p-10 space-y-8 z-30 p-8"
            {open}>
        <div class="space-y-2">
            <p class="text-2xl">Oh no! The ghosts in the Haunted House are causing trouble again!</p>
            <p>We need fearless daredevils to clear the mansion. Do you
                have
                what it takes? If so, keep reading!</p>
        </div>
        <div class="space-y-2">
            <p>Here's what we know: ghosts are vulnerable to plasma that matches their color. Pink ghosts can be
                caught with
                pink plasma, blue ghosts with blue plasma, and so on.</p>
            <p>You'll be equipped with a plasma shooter capable of firing two-cell bullets. Your mission is to guide
                these
                bullets so they release plasma upon colliding with obstacles - ghosts or other plasma.</p>
            <p>To catch a ghost, you'll need to align at least three plasma cells of the same color in a row — either
                horizontally or vertically.</p>
            <p>But that's not all! You'll also receive two special bullets with unique abilities to help you on your
                journey. Use them wisely!</p>
        </div>
        <div class="space-y-2">
            <p>Are you ready to face the challenge? Let's begin!</p>
        </div>
        <div class="w-full text-center">
            <button class="px-2 py-3 bg-pink-500 rounded-lg text-2xl w-52" onclick={handleStartGame}>Enter house</button>
        </div>
    </dialog>
{/if}

<style>
    .semi-transparent {
        background-color: rgba(11, 7, 22, 0.75);
    }
</style>