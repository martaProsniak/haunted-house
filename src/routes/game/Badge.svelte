<script lang="ts">
    import {scale} from "svelte/transition";

    interface Props {
        count: number;
        color: string;
        top?: number;
        left?: number;
    }

    const {count, color, top = 24, left = 24}: Props = $props();
</script>


{#key count}
    <div class="absolute text-center shadow bg-black text-violet-100 shadow-gradient rounded-full badge text-sm h-8 leading-8 font-bold"
         transition:scale|local={{duration: 300}}
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