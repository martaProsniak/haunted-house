<script lang="ts">
    import {nextPlasmaColors, gameStatus, isPaused} from "./gameState.svelte.js"
    import {flyingPlasmaImages} from "./constants";
    import {scale} from "svelte/transition";

    let hidden = $derived($gameStatus !== 'playing' && !$isPaused);

</script>

<p class="mb-4">Next plasma:</p>
{#if !hidden}
    <div    transition:scale={{duration: 300}}
            class="pill"
            style:background-image={`url("${flyingPlasmaImages[nextPlasmaColors.current][nextPlasmaColors.derived]}")`}>
    </div>
{/if}

<style>
    .pill {
        width: 84px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;
    }
</style>