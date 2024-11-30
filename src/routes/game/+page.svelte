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
        height: 100vh;
        width: 100vw;
        grid-template-columns: 1fr;
        grid-template-rows: 200px minmax(708px, 1fr) 100px;
        grid-template-areas: 'header' 'game' 'footer';
        background-color: antiquewhite;
        max-width: 1440px;

        .header {
            grid-area: header;
            background-color: lightpink;
        }

        .game {
            grid-area: game;
            background-color: rebeccapurple;
        }

        .footer {
            grid-area: footer;
            background-color: blueviolet;
        }
    }
</style>