<script>
    import Game from './Game.svelte';
    import WelcomeModal from "./WelcomeModal.svelte";
    import EndLevelModal from "./EndLevelModal.svelte";
</script>


<WelcomeModal />
<EndLevelModal />
<div class="container mx-auto">
    <Game />
</div>



<style>
    .container {
        width: fit-content;
    }
</style>