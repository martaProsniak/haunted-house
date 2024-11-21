<script lang="ts">
    import {previousPills} from './game.state.svelte';

    const {offset} = $props();
</script>

<div class="absolute">
    {#each previousPills as pill}
        <div
                style:background-color={pill.color}
                style:top={`${pill.row * offset}px`}
                style:left={`${pill.column * offset}px`}
                class={`pill-previous ${pill.border}`}>
        </div>
    {/each}
</div>

<style>
    .pill-previous {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
    }
</style>