<script lang="ts">
    import {fade, scale} from "svelte/transition";
    import {mapColorsToHex} from "./constants";
    import type {Color} from "./types";

    interface Props {
        count: number;
        color: string;
        top?: number;
        left?: number;
    }

    const {count, color, top = 24, left = 24}: Props = $props();
    let boxShadowColor = $derived(mapColorsToHex[(color as Color)])
</script>


{#key count}
    <div class="absolute text-center font-luckiest bg-violet-200 text-stone-900 rounded-full badge text-sm h-8 leading-9 font-bold"
         transition:scale|local={{duration: 300}}
         style:box-shadow={`0 0 2px 2px ${boxShadowColor}`}
         style:top={`${top}px`}
         style:left={`${left}px`}
    >
        {count}
    </div>
{/key}


<style>
    .badge {
        min-width: 32px;
    }
</style>