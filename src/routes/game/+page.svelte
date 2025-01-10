<script lang="ts">
    import Game from './Game.svelte';
    import WelcomeModal from "./WelcomeScreen.svelte";
    import {gameStatus} from "./gameState.svelte";
    import {setLocalData} from "./gameState.helpers.svelte";
    import {onMount} from "svelte";
    import pinkGhostGif from "$lib/assets/ghost-pink.gif";
    import blueGhostGif from "$lib/assets/ghost-blue.gif";
    import greenGhostGif from "$lib/assets/ghost-green.gif";
    import explosionImage from "$lib/assets/explosion.gif";
    import plasmaPinkPink from '$lib/assets/flying-pink-pink.png';
    import plasmaPinkBlue from '$lib/assets/flying-pink-blue.png';
    import plasmaPinkGreen from '$lib/assets/flying-pink-green.png';
    import plasmaBluePink from '$lib/assets/flying-blue-pink.png';
    import plasmaBlueBlue from '$lib/assets/flying-blue-blue.png';
    import plasmaBlueGreen from '$lib/assets/flying-blue-green.png';
    import plasmaGreenPink from '$lib/assets/flying-green-pink.png';
    import plasmaGreenBlue from '$lib/assets/flying-green-blue.png';
    import plasmaGreenGreen from '$lib/assets/flying-green-green.png';


    let showGame = $derived($gameStatus !== 'not-started');

    const getRecords = () => {
        const bestScore = Number.parseInt((localStorage.getItem("bestScore") ?? '')) ?? 0;
        const maxFloor = Number.parseInt((localStorage.getItem("maxFloor") ?? '')) ?? 0;

        setLocalData(bestScore, maxFloor);
    }

    onMount(() => {
        getRecords();
    })
</script>

<svelte:head>
    <link rel="preload" href={pinkGhostGif} as="image" type="image/gif" />
    <link rel="preload" href={blueGhostGif} as="image" type="image/gif" />
    <link rel="preload" href={greenGhostGif} as="image" type="image/gif" />
    <link rel="preload" href={explosionImage} as="image" type="image/gif" />
    <link rel="preload" href={plasmaPinkGreen} as="image" type="image/gif" />
    <link rel="preload" href={plasmaPinkBlue} as="image" type="image/gif" />
    <link rel="preload" href={plasmaPinkPink} as="image" type="image/gif" />
    <link rel="preload" href={plasmaBlueGreen} as="image" type="image/gif" />
    <link rel="preload" href={plasmaBlueBlue} as="image" type="image/gif" />
    <link rel="preload" href={plasmaBluePink} as="image" type="image/gif" />
    <link rel="preload" href={plasmaGreenBlue} as="image" type="image/gif" />
    <link rel="preload" href={plasmaGreenGreen} as="image" type="image/gif" />
    <link rel="preload" href={plasmaGreenPink} as="image" type="image/gif" />
</svelte:head>

{#if showGame}
    <Game/>
{:else}
    <WelcomeModal/>
{/if}
