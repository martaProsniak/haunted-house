<script lang="ts">
    import {nextPlasmaColors} from "./gameState.svelte.js"
    import {flyingPlasmaImages} from "./constants";
    import {scale} from "svelte/transition";
    import {onMount} from "svelte";
    import Header from "$lib/components/Header.svelte";

    let hidden = $state(true);

    onMount(() => {
        hidden = false;
    })

</script>

<div class="space-y-2">
    {#if !hidden}
        <Header text="Next bullet" />
        <div    transition:scale={{duration: 300}}
                class="pill"
                style:background-image={`url("${flyingPlasmaImages[nextPlasmaColors.current][nextPlasmaColors.derived]}")`}>
        </div>
    {/if}
</div>

<style>
    .pill {
        width: 84px;
        height: 40px;
        z-index: 10;
        box-sizing: border-box;
    }
</style>