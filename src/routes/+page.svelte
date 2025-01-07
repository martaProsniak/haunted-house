<script lang="ts">
    import {fade} from "svelte/transition";
    import FloatingText from "$lib/components/FloatingText.svelte";
    import {onMount} from "svelte";

    let mounted = false;
    onMount(() => {
        mounted = true;
    });
</script>

<main class="w-8/12 mx-auto space-y-4">
    {#if mounted}
        <h1 class="w-full font-bold block text-5xl md:text-8xl mt-2 shadow-ghost font-creepster" in:fade={{duration:1000}}>
                <FloatingText text="Haunted House" />
        </h1>
        <div class="w-full text-2xl xl:text-4xl" in:fade={{duration:500}}>
            <a class="cursor-pointer hover:text-violet-400 transition-colors" href="/game">Play</a>
            |
            <a class="cursor-pointer hover:text-violet-400 transition-colors" href="/guide">Guide</a>
        </div>
    {/if}
</main>
