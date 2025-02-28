<script lang="ts">
    import {fade} from "svelte/transition";
    import FloatingText from "$lib/components/FloatingText.svelte";
    import {onMount} from "svelte";

    let mounted = false;

    onMount(() => {
        mounted = true;
    });
</script>

<main class="w-8/12 lg:w-1/2 md:mx-auto px-6 space-y-2">
    {#if mounted}
        <h1 class="font-bold block text-3xl md:text-6xl lg:text-8xl mt-2 text-shadow-ghost font-creepster text-violet-200" in:fade={{duration:500}}>
                <FloatingText text="Haunted House" />
        </h1>
        <div class="w-full space-x-2 text-lg md:text-2xl lg:text-4xl" in:fade={{duration:1000, delay:500}}>
            <a class="cursor-pointer text-spooky" href="/game">Play</a>
            <span>|</span>
            <a class="cursor-pointer text-spooky" href="/guide">Guide</a>
        </div>
    {/if}
</main>

<style>
    main {
     display: flex;
     flex-direction: column;
     justify-content: center;
     height: 100%;
    }
</style>