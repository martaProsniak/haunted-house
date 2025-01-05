<script lang="ts">
    import {fade} from "svelte/transition";

    import KeyboardManual from "../game/KeyboardManual.svelte";
    import pinkPlasma from '$lib/assets/plasma-pink.png';
    import bluePlasma from '$lib/assets/plasma-blue.png';
    import greenPlasma from '$lib/assets/plasma-green.png';
    import pinkGhost from '$lib/assets/ghost-pink.png';
    import blueGhost from '$lib/assets/ghost-blue.png';
    import greenGhost from '$lib/assets/ghost-green.png';
    import plasmaPinkGreen from '$lib/assets/flying-pink-green.png';
    import bulletBomb from '$lib/assets/flying-bomb.png';
    import bulletRainbow from '$lib/assets/flying-rainbow.png';
    import greenGhostGif from "$lib/assets/ghost-green.gif";
    import blueGhostGif from "$lib/assets/ghost-blue.gif";
    import pinkGhostGif from "$lib/assets/ghost-pink.gif";
    import pinkGhostGlued from "$lib/assets/ghost-pink-glued.png";
    import blueGhostGlued from "$lib/assets/ghost-blue-glued.png";
    import greenGhostGlued from "$lib/assets/ghost-green-glued.png";

    import Logo from '$lib/components/Logo.svelte';
    import Header from "$lib/components/Header.svelte";

    const sections = [
        {
            title: 'Ghosts',
            id: 1
        },
        {
            title: 'Weapon',
            id: 2
        },
        {
            title: 'Gotchas!',
            id: 3
        },
        {
            title: 'Steering',
            id: 4
        },
        {
            title: 'Equipment',
            id: 5
        }
    ]

    let activeSection = $state(1);

    const changeActiveSection = (next: number): void => {
        activeSection = next;
    }
</script>

{#snippet basics()}
    <Header text="How to catch a ghost?"/>
    <p>There are three kind of ghosts: pink, blue and green. You need to match every ghost with at least 3
        plasma with the same color.</p>
    <div class="flex items-center gap-x-6">
        <div>
            <img class="inline" src={pinkGhost} alt="pink ghost">
            <span>-></span>
            <img class="inline" src={pinkPlasma} alt="pink plasma">
        </div>
        <div>
            <img class="inline" src={blueGhost} alt="blue ghost">
            <span>-></span>
            <img class="inline" src={bluePlasma} alt="blue plasma">
        </div>
        <div>
            <img class="inline" src={greenGhost} alt="green ghost">
            <span>-></span>
            <img class="inline" src={greenPlasma} alt="green plasma">
        </div>
    </div>
{/snippet}

{#snippet escape()}
    <Header text="Ghosts try to escape!"/>
    <p>They move up one by one. If something blocks their way, they will try to go around the obstacle.</p>
    <p>You can tell which ghost will move next by watching them. They start to stomp on the spot right before they
        move.</p>
    <div class="space-x-4">
        <img class="inline" src={pinkGhostGif} alt="pink ghost stomping">
        <img class="inline" src={blueGhostGif} alt="blue ghost stomping">
        <img class="inline" src={greenGhostGif} alt="green ghost stomping">
    </div>
    <p>Here's some good news - if you place plasma in their color anywhere next to them, they will loose ability to
        move! Plasma is veeery sticky.</p>
    <p>Try to glue the ghosts in the first place! If you allow three ghosts to escape, they will warn all other ghosts
        and you'll have to start over the next evening.</p>
    <p>Besides, they make quite funny faces:</p>
    <div class="space-x-4">
        <img class="inline" src={pinkGhostGlued} alt="pink ghost glued">
        <img class="inline" src={blueGhostGlued} alt="blue ghost glued">
        <img class="inline" src={greenGhostGlued} alt="green ghost glued">
    </div>
{/snippet}

{#snippet weapon()}
    <Header text="Your weapon"/>
    <p>You will be provided with special Spooky Plasma Shooter! It's filled with two-cell plasma bullets. Released
        bullet will move down in interval. If the bullet will collide with an obstacle, it will break in half and
        leave two plasmas
        on the floor.</p>
    <p>Example:</p>
    <div>
        <img class="inline" src={plasmaPinkGreen} alt="plasma bullet">
        <span>-></span>
        <img class="inline" src={pinkPlasma} alt="pink plasma">
        <span>+</span>
        <img class="inline" src={greenPlasma} alt="green plasma">
    </div>
    <p>Watch out! As plasma is immaterial, every loose molecule will go down until it will hit the obstacle or be
        next to the ghost in the same color.</p>
{/snippet}

{#snippet controls()}
    <Header text="Steering bullets"/>
    <p>You steer bullets with keyboard (Spooky Plasma Shooter is compatible with any keyboard!). Use arrows to move
        the bullets across the house.</p>
    <KeyboardManual/>
{/snippet}

{#snippet equipment()}
    <Header text="Special bullets"/>
    <p>There are two kinds of special bullets which will speed up your work. Try them out!</p>
    <p class="flex items-center gap-x-2">
        <img src={bulletRainbow} alt="rainbow bullet">
        <span>-</span>
        <span>matches with every other color</span>
    </p>
    <p class="flex items-center gap-x-2">
        <img src={bulletBomb} alt="bomb bullet">
        <span>-</span>
        <span>creates big explosion, clearing whole rows where it was detonated</span>
    </p>
{/snippet}

<main class="py-8 px-16 semi-transparent w-full max-h-full min-h-1/2 overflow-hidden rounded-lg space-y-8 text-lg max-w-[1000px]">
    <Logo />
    <ul class="flex gap-x-2 flex-row overflow-x-auto">
        {#each sections as section}
            <li class="text-2xl  w-full text-center rounded-full transition-all bg-black border-solid border-2 border-violet-700 hover:bg-violet-800">
                <button class="w-full h-full p-2 rounded-full"
                        class:bg-violet-500={section.id === activeSection}

                        onclick={() => changeActiveSection(section.id)}>{section.title}</button>
            </li>
        {/each}
    </ul>
    {#key activeSection}
        <div class="space-y-4 w-full h-[300px] overflow-y-auto" in:fade={{duration:500}}>
            {#if activeSection === 1}
                {@render basics()}
            {:else if activeSection === 2}
                {@render weapon()}
            {:else if activeSection === 3}
                {@render escape()}
            {:else if activeSection === 4}
                {@render controls()}
            {:else}
                {@render equipment()}
            {/if}
        </div>
    {/key}
    <div class="text-right">
        <a class="inline-block text-center text-3xl shadow font-bold"
           href="/game">Start adventure!</a>
    </div>
</main>

<style>

</style>