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


<div class="inline-flex">
    {#each text.split('') as letter, i}
        {#if mounted}
    <span
            class="inline-block"
            in:fly="{{ y: 40, x: 0 , duration: 1500, delay:  (i * 150), easing: backOut  }}"
    >
      {letter === ' ' ? '\u00A0' : letter}
    </span>
        {/if}
    {/each}
</div>
