<script>
    import Game from './game.svelte';
    import Header from './header.svelte';
    import Footer from './footer.svelte';
    import WelcomeModal from "./welcomeModal.svelte";
    import {gameStatus} from "./gameState.svelte"

    let showWelcomeModal = $state(true);

    const startGame = () => {
        showWelcomeModal = false;
        $gameStatus = 'started';
    }
</script>

<Header />
<div class="container max-h-screen grid gap-4 mx-auto ">
    <div class="game rounded-xl">
        <Game />
    </div>
    <footer class="footer">
        <Footer />
    </footer>
    {#if showWelcomeModal}
        <WelcomeModal {startGame} />
    {/if}
</div>



<style>
    .container {
        grid-template-columns: 1fr;
        grid-template-rows: minmax(620px, 1fr) 100px;
        grid-template-areas: 'game' 'footer';
        width: fit-content;

        .game {
            grid-area: game;
            background-color: rgba(12, 12, 13, 0.78);
        }

        .footer {
            grid-area: footer;
        }
    }
</style>