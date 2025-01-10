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
    <Header large={true} text="Help! Ghosts are stacking back again!"/>
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
    <Header large={true} text="Ghosts try to get you!"/>
    <p>Well, maybe not you directly, but your drone. They move up one by one. If something is above them (other ghost or
        plasma slime), they try to go around the obstacle</p>
    <p>You can tell which ghost will move next by watching them. They kind of dance around right before they
        move.</p>
    <div class="space-x-4">
        <img class="inline" src={pinkGhostGif} alt="pink ghost dancing">
        <img class="inline" src={blueGhostGif} alt="blue ghost dancing">
        <img class="inline" src={greenGhostGif} alt="green ghost dancing">
    </div>
    <p class="text-2xl">Immobilizing ghosts</p>
    <p>Here's some good news - if ghost is next to plasma of the same color, it will loose ability to
        move! Plasma slimes are veeery sticky.</p>
    <p>Try to glue ghosts in the first place! If the ghost reach your Spooky Plasma Drone, it starts howling on a
        frequency that is
        destructive to it. If you allow three ghosts around it, it's programmed to abort the mission.</p>
    <p>Besides, ghosts make quite funny faces when they're glued:</p>
    <div class="space-x-4">
        <img class="inline" src={pinkGhostGlued} alt="pink ghost glued">
        <img class="inline" src={blueGhostGlued} alt="blue ghost glued">
        <img class="inline" src={greenGhostGlued} alt="green ghost glued">
    </div>
{/snippet}

{#snippet weapon()}
    <Header large={true} text="Spooky Plasma Drone (Patent Pending)"/>
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
    <div class="space-y-6">
        <div class="space-y-2 mt-8">
            <p class="text-2xl">Fun Part No. 1:</p>
            <p>Loose plasma slime (the one without any other object beneath it) will fall down, until it will hit the
                obstacle. You can use this wisely to catch ghosts more efficient! Slime also stops moving if it's placed next to
                the ghost in the same color.</p>
        </div>
        <div class="space-y-2">
            <p class="text-2xl">Fun Part No. 1:</p>
            <p>While they falling down, every slime scan surrounding space! If you match 4 or more objects in the same color,
                they all poof! disappear.</p>
        </div>
    </div>

{/snippet}

{#snippet controls()}
    <Header large={true} text="Quick or precise?"/>
    <p>You steer bullets with keyboard (Spooky Plasma Drone is compatible with any keyboard!). Use arrows to move
        the bullets across the house.</p>
    <KeyboardManual/>
{/snippet}

{#snippet equipment()}
    <Header large={true} text="Special bullets to the rescue!"/>
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

<main
        class="py-10 px-6 bg-semi-transparent w-full h-full max-h-[640px] overflow-auto rounded-lg text-lg max-w-[1000px] container">
    <ul class="flex flex-col justify-start items-center gap-y-8 buttons overflow-auto py-2 px-12">
        {#each sections as section}
            <li class="w-32">
                <Button onclick={() => changeActiveSection(section.id)} active={section.id === activeSection}
                        classes="bg-darkViolet py-3">
                    {section.title}
                </Button>
            </li>
        {/each}
    </ul>
    <div class="w-[1px] border-none bg-gradient divider"></div>
    {#key activeSection}
        <section class="space-y-4 section overflow-y-auto px-12 pb-6 pt-2 guide mb-6" in:fade={{duration:500}}>
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
        </section>
    {/key}

    <nav class="nav">
        <hr class="w-full mx-auto border-none h-[1px] bg-gradient"/>
        <div class="flex justify-evenly items-center flex-row flex-wrap gap-y-4 gap-x-4 pt-6">
            <a class="w-full order-2 md:order-1 md:w-1/3 text-center text-spooky text-2xl"
               href="/">Go home</a>
            <a class="w-full order-1 md:order-2 md:w-1/3 text-center text-3xl font-bold text-spooky"
               href="/game">Start adventure!</a>
        </div>
    </nav>
</main>

<style>
    .container {
        display: grid;
        grid-template-columns: 25% 1fr;
        grid-template-rows: 1fr 68px;
        grid-template-areas: 'buttons divider guide' 'nav nav nav';

        .buttons {
            grid-area: buttons;
        }

        .guide {
            grid-area: guide;
        }

        .divider {
            grid-area: divider;
        }

        .nav {
            grid-area: nav;
        }
    }
</style>