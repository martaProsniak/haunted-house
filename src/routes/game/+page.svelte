<script>
    import Game from './game.svelte';
    import WelcomeModal from "./welcomeModal.svelte";
    import EndLevel from "./endLevel.svelte";
    import Pause from "./pause.svelte";
</script>


<WelcomeModal />
<EndLevel />
<Pause />
<div class="container mx-auto">
    <Game />
</div>



<style>
    .container {
        width: fit-content;
    }
</style>