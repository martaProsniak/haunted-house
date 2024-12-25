<script>
    import Game from './Game.svelte';
    import WelcomeModal from "./WelcomeModal.svelte";
</script>

<WelcomeModal />
<div class="container mx-auto">
    <Game />
</div>



<style>
    .container {
        width: fit-content;
    }
</style>