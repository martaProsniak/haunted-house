<script lang="ts">
    import {fade} from "svelte/transition";
    import {onMount} from "svelte";

    let mounted = false;
    onMount(() => {
        mounted = true;
    });
</script>

<main class="w-8/12 mx-auto">
    <h1 class="text-4xl w-full h-[160px]">
        {#if mounted}
                <span in:fade={{duration:1000}}
                      class="font-bold block text-5xl md:text-7xl xl:text-9xl mt-2 mb-8 font-creepster logo"
                >Haunted House</span>
        {/if}
    </h1>
    <div class="w-full text-2xl xl:text-4xl">
        <a class="cursor-pointer hover:text-violet-400 transition-colors" href="/game">Play</a>
        |
        <a class="cursor-pointer hover:text-violet-400 transition-colors" href="/guide">Guide</a>
    </div>
</main>

<style>
    .logo {
        text-shadow: 0 2px 0.1em #ec3597, 0 2px 0.2em #2398ec, 0 0 0.1em #45e732;
    }
</style>