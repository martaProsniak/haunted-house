<script lang="ts">
    import {nextPlasmaColors, gameStatus, isPaused} from "./gameState.svelte.js"
    import {flyingPlasmaImages} from "./constants";
    import {scale} from "svelte/transition";
    import {onMount} from "svelte";

    let hidden = $state(true);

    onMount(() => {
        hidden = false;
    })

</script>

<div class="space-y-2">
    {#if !hidden}
        <p class="font-luckiest">Next plasma bullet:</p>
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