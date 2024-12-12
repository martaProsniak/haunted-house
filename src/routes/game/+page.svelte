<script>
    import Game from './game.svelte';
    import Header from './header.svelte';
    import Footer from './footer.svelte';

</script>

<div class="container mx-auto max-h-screen grid gap-4">
    <div class="header">
        <Header />
    </div>
    <div class="game rounded-xl">
        <Game />
    </div>
    <footer class="footer">
        <Footer />
    </footer>
</div>



<style>
    .container {
        grid-template-columns: 1fr;
        grid-template-rows: minmax(100px, 1fr) minmax(808px, 1fr) minmax(80px, 1fr);
        grid-template-areas: 'header' 'game' 'footer';
        max-width: 1440px;

        .header {
            grid-area: header;
        }

        .game {
            grid-area: game;
            background-color: rgba(12, 12, 13, 0.78);
        }

        .footer {
            grid-area: footer;
        }
    }
</style>