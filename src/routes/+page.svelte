<script lang="ts">
    import {fade} from "svelte/transition";
    import FloatingText from "$lib/components/FloatingText.svelte";
    import {onMount} from "svelte";

    let mounted = false;

    const getLocalData = () => {
        const bestScore = localStorage.getItem("bestScore");
        const maxFloor = localStorage.getItem("maxFloor");
    }

    onMount(() => {
        mounted = true;
    });
</script>

<main class="w-8/12 mx-auto space-y-4">
    {#if mounted}
        <h1 class="w-full font-bold block text-5xl md:text-8xl mt-2 text-shadow-ghost font-creepster" in:fade={{duration:500}}>
                <FloatingText text="Haunted House" />
        </h1>
        <div class="w-full space-x-2 text-2xl xl:text-4xl" in:fade={{duration:500}}>
            <a class="cursor-pointer text-spooky" href="/game">Play</a>
            <span>|</span>
            <a class="cursor-pointer text-spooky" href="/guide">Guide</a>
        </div>
    {/if}
</main>