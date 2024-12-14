<script lang="ts">
    import {fly, fade} from "svelte/transition";

    const {startGame} = $props();

</script>

<dialog transition:fly={{duration: 200}}
        class="w-8/12 h-[700px] bg-black text-white text-center text-2xl rounded-lg p-10 space-y-4 z-30" open>
    <p>Hello, ghostbuster apprentice!</p>
    <p>Lorem ipsum</p>
    <button class="p-4 bg-pink-500 rounded-lg w-52" onclick={startGame}>Start new game</button>
</dialog>

<style>

</style>