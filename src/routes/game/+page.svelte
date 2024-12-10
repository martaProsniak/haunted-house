<script>
    import Game from './game.svelte';
    import Header from './header.svelte';
    import Footer from './footer.svelte';

</script>

<div class="container mx-auto max-h-screen grid gap-4">
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
        grid-template-columns: 1fr;
        grid-template-rows: minmax(150px, 1fr) minmax(828px, 2fr) minmax(80px, 1fr);
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