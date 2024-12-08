<script lang="ts">
    import {nextPlasmaColors, gameStatus, isPaused} from "./gameState.svelte.js"

    import plasmaBlueBlue from '$lib/assets/flying-blue-blue.png';
    import plasmaPinkPink from '$lib/assets/flying-pink-pink.png';
    import plasmaGreenGreen from '$lib/assets/flying-green-green.png';
    import plasmaGreenBlue from '$lib/assets/flying-green-blue.png';
    import plasmaGreenPink from '$lib/assets/flying-green-pink.png';
    import plasmaBluePink from '$lib/assets/flying-blue-pink.png';
    import plasmaPinkBlue from '$lib/assets/flying-pink-blue.png';
    import plasmaPinkGreen from '$lib/assets/flying-pink-green.png';
    import plasmaBlueGreen from '$lib/assets/flying-blue-green.png';

    const flyingPlasmaImages = {
        pink: {
            pink: plasmaPinkPink,
            blue: plasmaPinkBlue,
            green: plasmaPinkGreen
        },
        blue: {
            pink: plasmaBluePink,
            blue: plasmaBlueBlue,
            green: plasmaBlueGreen
        },
        green: {
            pink: plasmaGreenPink,
            blue: plasmaGreenBlue,
            green: plasmaGreenGreen
        }
    };

    let hidden = $derived($gameStatus !== 'playing' && !$isPaused);

</script>

<p class="mb-4">Next plasma:</p>
<div
        class="pill"
        class:hidden
        style:background-image={`url("${flyingPlasmaImages[nextPlasmaColors.current][nextPlasmaColors.derived]}")`}>
</div>

<style>
    .pill {
        width: 84px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;
    }

    .hidden {
        display: none;
    }
</style>