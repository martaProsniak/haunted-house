<script>
    import Game from './game.svelte';
    import WelcomeModal from "./welcomeModal.svelte";
    import EndLevel from "./endLevel.svelte";
</script>


<WelcomeModal />
<EndLevel />
<div class="container mx-auto">
    <Game />
</div>



<style>
    .container {
        width: fit-content;
    }
</style>