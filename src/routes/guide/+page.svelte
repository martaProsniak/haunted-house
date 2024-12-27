<script lang="ts">
</script>

<main class="place-self-start py-8 px-16 semi-transparent w-2/3 max-h-full overflow-y-scroll rounded-lg space-y-6 text-xl">
    <div class="space-y-2">
        <h1 class="text-4xl">Tips for brave daredevils!</h1>
    </div>
    <div class="space-y-2">
        <h2 class="text-3xl text-violet-300">How to catch a ghost?</h2>
        <p>There are three kind of ghosts: pink, blue and green. You need to match them with at least 3
            plasma with the same color.</p>
        <p>But be careful! Ghosts are trying to escape!</p>
    </div>
    <div class="space-y-2">
        <h2 class="text-3xl text-violet-300">What? Escape?</h2>
        <p>Yeah, did you think they will just wait until you catch them? Oh no, not these ones.</p>
        <p>But don't worry, we figured them out!</p>
        <p>They move one by one. Their primary direction is always up, unless you block their way with a plasma. In that
            case they will attempt to go right, and if it also won't be possible, they will try to move left. You need
            to block them as soon as you can!</p>
        <p>If you allow three ghosts to escape, they will attack you and you'll have to start over!</p>
    </div>
    <div>
        <p>Here's some good news - if you place matching plasma next to them, they will loose ability to move! Plasma is
            veeery sticky.</p>
    </div>
    <div class="space-y-2">
        <h2 class="text-3xl text-violet-300">Your weapon</h2>
        <p>You will be provided with special Spooky Plasma Shooter! It's filled with two-cell plasma bullets. Released
            bullet will move down in interval. If the bullet will collide with an obstacle, it will break in half and leave two plasmas
            on the floor.</p>
        <p>Watch out! As plasma is immaterial, every loose molecule will go down until it'll hit the obstacle.</p>
    </div>
    <div class="space-y-2">
        <h2 class="text-3xl text-violet-300">Steering bullets</h2>
        <p>You steer bullets with keyboard (Spooky Plasma Shooter is compatible with any keyboard!). Use arrows to move
            the bullets across the house.</p>
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