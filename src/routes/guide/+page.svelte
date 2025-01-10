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
    import Button from "$lib/components/Button.svelte";

    const sections = [
        {
            title: 'Ghosts!',
            id: 1
        },
        {
            title: 'Plasma!',
            id: 2
        },
        {
            title: 'Gotchas!',
            id: 3
        },
        {
            title: 'Controls!',
            id: 4
        },
        {
            title: 'Goodies!',
            id: 5
        }
    ]

    let activeSection = $state(1);

    const changeActiveSection = (next: number): void => {
        activeSection = next;
    }
</script>

{#snippet basics()}
    <Header text="Help! Ghosts are stacking back again!"/>
    <p>They may look cute, but they are a nuisance to local residents. They love all mischief and pranks.</p>
    <p>There come in three colors: pink, blue and green.</p>

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
    <p>Colors are important - you need to match ghost with corresponding plasma in order to catch it.</p>
    <p>You need to match every ghost with at least 3
        plasma slimes in the same color.</p>
{/snippet}

{#snippet gotchas()}
    <Header text="Ghosts try get you!"/>
    <p>Well, maybe not you directly, but your drone. They move up one by one. If something is above them (other ghost or
        plasma slime), they try to go around the obstacle</p>
    <p>You can tell which ghost will move next by watching them. They kind of dance around right before they
        move.</p>
    <div class="space-x-4">
        <img class="inline" src={pinkGhostGif} alt="pink ghost dancing">
        <img class="inline" src={blueGhostGif} alt="blue ghost dancing">
        <img class="inline" src={greenGhostGif} alt="green ghost dancing">
    </div>
    <p>Here's some good news - if you place slime in their color anywhere next to them, they will loose ability to
        move! Plasma is veeery sticky.</p>
    <p>Try to glue ghosts in the first place! If the ghost reach your Spooky Plasma Drone, it starts howling on a frequency that is
        destructive to it. If you allow three ghosts around it, it's programmed to abort the mission.</p>
    <p>Besides, ghosts make quite funny faces when they're glued:</p>
    <div class="space-x-4">
        <img class="inline" src={pinkGhostGlued} alt="pink ghost glued">
        <img class="inline" src={blueGhostGlued} alt="blue ghost glued">
        <img class="inline" src={greenGhostGlued} alt="green ghost glued">
    </div>
{/snippet}

{#snippet weapon()}
    <Header text="Spooky Plasma Drone (Patent Pending)"/>
    <p>We hid something in the bushes next to the house! It's our secret weapon - a drone, which releases two-cell
        plasma bullets.</p>
    <p>Bullets go down in interval. You can control them with your keyboard. They split in two plasma slimes after
        hitting something (ghost or other slime). Like so:</p>
    <div>
        <img class="inline" src={plasmaPinkGreen} alt="plasma bullet">
        <span>-></span>
        <img class="inline" src={pinkPlasma} alt="pink plasma">
        <span>+</span>
        <img class="inline" src={greenPlasma} alt="green plasma">
    </div>
    <p>Fun part: loose plasma slimes (the ones without any other object beneath it) will fall down, until they hit the
        obstacle. You can use this wisely to catch ghosts more efficient!</p>
{/snippet}

{#snippet controls()}
    <Header text="Steering bullets"/>
    <p>You steer bullets with keyboard (Spooky Plasma Drone is compatible with any keyboard!). Use arrows to move
        the bullets across the house.</p>
    <KeyboardManual/>
{/snippet}

{#snippet equipment()}
    <Header text="Special bullets to the rescue"/>
    <p>There are two kinds of special bullets which will speed up your work or even save your skin (well, again, not
        yours directly). Try them out!</p>
    <p class="flex items-center gap-x-2">
        <img src={bulletRainbow} alt="rainbow bullet">
        <span>-</span>
        <span>matches with every other color. Sometimes the right bullet just don't want to come!</span>
    </p>
    <p class="flex items-center gap-x-2">
        <img src={bulletBomb} alt="bomb bullet">
        <span>-</span>
        <span>creates big explosion, clearing whole rows where it was detonated. Can save you in really tough situations!</span>
    </p>
{/snippet}

<main class="py-8 px-16 bg-semi-transparent w-full max-h-full min-h-1/2 overflow-auto rounded-lg space-y-6 text-lg max-w-[1000px]">
    <ul class="flex gap-x-2 flex-row overflow-x-auto justify-between p-2">
        {#each sections as section}
            <li class="w-1/6 min-w-32">
                <Button onclick={() => changeActiveSection(section.id)} active={section.id === activeSection}
                        classes="bg-darkViolet">
                    {section.title}
                </Button>
            </li>
        {/each}
    </ul>
    {#key activeSection}
        <div class="space-y-4 w-full h-[300px] overflow-y-auto px-2" in:fade={{duration:500}}>
            {#if activeSection === 1}
                {@render basics()}
            {:else if activeSection === 2}
                {@render weapon()}
            {:else if activeSection === 3}
                {@render gotchas()}
            {:else if activeSection === 4}
                {@render controls()}
            {:else}
                {@render equipment()}
            {/if}
        </div>
    {/key}
    <div class="flex justify-evenly items-center flex-row flex-wrap gap-y-4 gap-x-4">
        <a class="w-full order-2 md:order-1 md:w-5/12 text-center text-spooky text-2xl"
           href="/">Go home</a>
        <a class="w-full order-1 md:order-2 md:w-5/12 text-center text-3xl font-bold text-spooky"
           href="/game">Start adventure!</a>
    </div>
</main>

<style>

</style>