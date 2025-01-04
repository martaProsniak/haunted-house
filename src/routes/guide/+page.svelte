<script lang="ts">
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

    import Logo from '$lib/components/Logo.svelte';

    const sections = [
        {
            title: 'How does it work?',
            id: 1
        },
        {
            title: 'Prevent escaping!',
            id: 2
        },
        {
            title: 'Weapon',
            id: 3
        },
        {
            title: 'Controlling bullets',
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
    <h2 class="text-2xl text-violet-300 font-bold">How to catch a ghost?</h2>
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
    <p>But be careful! Ghosts are trying to escape!</p>
{/snippet}

{#snippet escape()}
    <h2 class="text-2xl text-violet-300 font-bold">What? Escape?</h2>
    <p>Yeah, did you think they will just wait until you catch them? Oh no, not these ones.</p>
    <p>But don't worry, we figured them out!</p>
    <p>They move up one by one. If something blocks their way, they will try to go around the obstacle.</p>
    <p>Here's some good news - <b>if you place plasma in their color anywhere next to them, they will loose ability to move!</b>
        Plasma is
        veeery sticky.</p>
    <p>Try to glue the ghosts in the first place!</p>
    <p>If you allow three ghosts to escape, they will warn all other ghosts and you'll have to start over the next evening.</p>
{/snippet}

{#snippet weapon()}
    <h2 class="text-2xl text-violet-300 font-bold">Your weapon</h2>
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
    <h2 class="text-2xl text-violet-300 font-bold">Steering bullets</h2>
    <p>You steer bullets with keyboard (Spooky Plasma Shooter is compatible with any keyboard!). Use arrows to move
        the bullets across the house.</p>
    <KeyboardManual/>
{/snippet}

{#snippet equipment()}
    <h2 class="text-2xl text-violet-300 font-bold">Special bullets</h2>
    <p>There are two kinds of special bullets which will speed up your work. Try them out!</p>
    <p class="flex items-center gap-x-2">
        <img src={bulletRainbow} alt="rainbow bullet">
        <span>-</span>
        <span>matches with every other color</span>
    </p>
    <p class="flex items-center gap-x-2">
        <img src={bulletBomb} alt="bomb bullet">
        <span>-</span>
        <span>does big boom boom!</span>
    </p>
{/snippet}

<main class="place-self-start py-8 px-16 semi-transparent w-full h-full max-h-full overflow-y-scroll rounded-lg space-y-10 text-xl max-w-[1000px]">

    <div class="space-y-2 flex items-center justify-between">
        <Logo />
        <div class="text-right">
            <a class="inline-block text-center font-cherryBomb p-3 bg-violet-900 hover:bg-violet-600 focus:bg-violet-600 transition-colors rounded-lg w-52"
               href="/game">Start adventure!</a>
        </div>
    </div>
    <h1 class="text-3xl">Tips for brave daredevils!</h1>
    <ul class="flex justify-between gap-x-2">
        {#each sections as section}
            <li class="px-2">
                <button onclick={() => changeActiveSection(section.id)}>{section.title}</button>
            </li>
        {/each}
    </ul>
    <div class="space-y-4 w-full">
        {#if activeSection === 1}
            {@render basics()}
        {:else if activeSection === 2}
            {@render escape()}
        {:else if activeSection === 3}
            {@render weapon()}
        {:else if activeSection === 4}
            {@render controls()}
        {:else}
            {@render equipment()}
        {/if}
    </div>
</main>

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