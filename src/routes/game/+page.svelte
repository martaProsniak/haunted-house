<script lang="ts">
    import Game from './Game.svelte';
    import WelcomeModal from "./WelcomeScreen.svelte";
    import {gameStatus} from "./gameState.svelte";
    import {setLocalData} from "./gameState.helpers.svelte";
    import {onMount} from "svelte";

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


{#if showGame}
    <Game/>
{:else}
    <WelcomeModal/>
{/if}
