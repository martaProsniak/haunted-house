<script lang="ts">
    import {fade} from "svelte/transition";
    import {onMount} from "svelte";

    let mounted = false;
    onMount(() => {
        mounted = true;
    });
</script>

<main class="w-8/12 mx-auto">
    <h1 class="text-3xl w-full min-h-[200px]">Welcome to
        {#if mounted}
                <span in:fade={{duration:1000}}
                      class="font-bold block text-5xl md:text-7xl xl:text-9xl mt-2 mb-8 font-creepster"
                >Haunted House</span>
        {/if}
    </h1>
    <div class="w-full text-2xl xl:text-3xl">
        <a class="cursor-pointer" href="/game">Play</a>
        |
        <a class="cursor-pointer" href="/guide">Guide</a>
    </div>
</main>