<script lang="ts">
    import {fly} from 'svelte/transition';
    import {onMount} from "svelte";
    import {backOut} from "svelte/easing";

    const {text} = $props();
    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });
</script>


<div class="animated-text">
    {#each text.split('') as letter, i}
        {#if mounted}
    <span
            class="letter"
            in:fly="{{ y: 80, x: 0, duration: 1000, delay: 500 + (i * 100), easing: backOut  }}"
    >
      {letter === ' ' ? '\u00A0' : letter}
    </span>
        {/if}
    {/each}
</div>


<style>
    .animated-text {
        display: inline-flex;
    }

    .letter {
        display: inline-block;
        transition: transform 0.3s ease-in-out;
    }

    .letter:hover {
        transform: scale(1.2) rotate(-10deg);
    }
</style>
