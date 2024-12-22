<script lang="ts">
    import {lives, initialLives} from "./gameState.svelte";
    import heartFull from '$lib/assets/heart-full.png'
    import heartEmpty from '$lib/assets/heart-empty.png'

    const hearts = $derived.by(() => {
        let length = $lives >= initialLives ? $lives : initialLives;
        return Array.from(Array(length).keys()).map((_, index) => {
            return {
                src: index > $lives - 1 ? heartEmpty : heartFull,
                text: index > $lives - 1 ? 'lost life' : 'life',
            }
        });
    })
</script>

<div class="flex flex-wrap gap-x-2">
    {#each hearts as heart}
        <div class="w-10 h-10">
            <img class="w-full" src={heart.src} alt={heart.text}>
        </div>
    {/each}
</div>