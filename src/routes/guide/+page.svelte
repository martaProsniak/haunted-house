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
</script>

<main class="place-self-start py-8 px-16 semi-transparent w-7/12 max-h-full overflow-y-scroll rounded-lg space-y-10 text-xl">
    <div class="space-y-2">
        <h1 class="text-3xl">Tips for brave daredevils!</h1>
    </div>
    <div class="space-y-4">
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
    </div>
    <div class="space-y-4">
        <h2 class="text-2xl text-violet-300 font-bold">What? Escape?</h2>
        <p>Yeah, did you think they will just wait until you catch them? Oh no, not these ones.</p>
        <p>But don't worry, we figured them out!</p>
        <p>They move one by one. Their primary direction is always up, unless you block their way with a plasma. In that
            case they will attempt to go right, and if it also won't be possible, they will try to move left. You need
            to block them as soon as you can!</p>
        <p>If you allow three ghosts to escape, the mission will be over and you'll have to start over!</p>
        <p>Here's some good news - <b>if you place matching plasma next to them, they will loose ability to move!</b>
            Plasma is
            veeery sticky.</p>
    </div>
    <div class="space-y-4">
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
    </div>
    <div class="space-y-4">
        <h2 class="text-2xl text-violet-300 font-bold">Steering bullets</h2>
        <p>You steer bullets with keyboard (Spooky Plasma Shooter is compatible with any keyboard!). Use arrows to move
            the bullets across the house.</p>
        <KeyboardManual/>
    </div>
    <div class="space-y-4">
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
    </div>
    <div class="text-2xl text-violet-300 font-bold">That's pretty much it. Good luck!</div>
    <div class="flex gap-x-8 justify-between">
        <a class="inline-block text-center font-cherryBomb p-3 shadow-violet-700 hover:bg-violet-900 focus:bg-violet-900 transition-colors rounded-lg w-52"
           href="/">Go back home</a>

        <a class="inline-block text-center font-cherryBomb p-3 bg-violet-900 hover:bg-violet-600 focus:bg-violet-600 transition-colors rounded-lg w-52"
           href="/game">Start adventure!</a>

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