<script lang="ts">
    import {nextPlasmaColors, gameStatus, isPaused} from "./gameState.svelte.js"
    import {flyingPlasmaImages} from "./constants";

    let hidden = $derived($gameStatus.includes('started'));

</script>

<p class="mb-4">Next plasma:</p>
<div
        class="pill"
        class:hidden
        style:background-image={`url("${flyingPlasmaImages[nextPlasmaColors.current][nextPlasmaColors.derived]}")`}>
</div>

<style>
    .pill {
        width: 84px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;
    }

    .hidden {
        display: none;
    }
</style>