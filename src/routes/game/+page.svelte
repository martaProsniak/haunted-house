<script lang="ts">
    import Game from './Game.svelte';
    import WelcomeModal from "./WelcomeScreen.svelte";
    import {gameStatus} from "./gameState.svelte";

    let showGame = $derived($gameStatus !== 'not-started');
</script>


{#if showGame}
    <Game/>
{:else}
    <WelcomeModal/>
{/if}
