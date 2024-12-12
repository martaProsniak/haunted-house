<script lang="ts">
    import {flyingPlasmaImages} from "./constants";
    import type {Color, Rotation} from "./types";
    import {fade} from "svelte/transition";

    interface Props {
        top: number,
        left: number,
        rotation: Rotation,
        flyingPlasmaColors: { current: Color, derived: Color },
        isPaused: boolean,
        isPlaying: boolean,
    }

    let {
        top, left, rotation, flyingPlasmaColors, isPaused, isPlaying
    }: Props = $props();
    let hidden = $derived(!isPlaying && !isPaused);

</script>

{#if !hidden}
    <div
            transition:fade={{duration:100, delay:100}}
            style:top={`${top}px`}
            style:left={`${left}px`}
            style:transform="{`rotate(${rotation}deg`}"
            class="pill"
            style:background-image={`url("${flyingPlasmaImages[flyingPlasmaColors.current][flyingPlasmaColors.derived]}")`}>
    </div>
{/if}

<style>
    .pill {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 84px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;
        transition: transform 0.1s linear;
    }
</style>