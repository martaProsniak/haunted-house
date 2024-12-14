<script lang="ts">
    import {fade, scale} from "svelte/transition";
    import {mapColorsToHex} from "./constants";
    import type {Color} from "./types";

    interface Props {
        count: number;
        color: string
    }

    const {count, color}: Props = $props();
    let boxShadowColor = $derived(mapColorsToHex[(color as Color)])
</script>


{#key count}
    <div class="absolute bg-white text-stone-900 rounded-full  badge text-base font-luckiest"
         transition:scale|local={{duration: 300}}
         style:box-shadow={`0 0 2px 2px ${boxShadowColor}`}
    >
        <div>{count}</div>
    </div>
{/key}


<style>
    .badge {
        width: 32px;
        height: 32px;
        top: 24px;
        left: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>