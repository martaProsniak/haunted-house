<script>
    import Game from './game.svelte';
    import Header from './header.svelte';
    import Footer from './footer.svelte';
</script>

<div class="container mx-auto">
    <div class="header">
        <Header />
    </div>
    <div class="game">
        <Game />
    </div>
    <footer class="footer">
        <Footer />
    </footer>
</div>



<style>
    .container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 150px minmax(708px, 1fr) 100px;
        grid-template-areas: 'header' 'game' 'footer';
        max-width: 1440px;

        .header {
            grid-area: header;
        }

        .game {
            grid-area: game;
        }

        .footer {
            grid-area: footer;
        }
    }
</style>