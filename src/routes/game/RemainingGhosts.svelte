<script lang="ts">
    import {groupGhostsPerColor} from "./utils";
    import type {BaseColor, Ghost} from "./types";
    import Badge from './Badge.svelte'
    import {ghostsImages, colors} from "./constants";

    interface Props {
        ghosts: Ghost[]
    }

    const {ghosts}: Props = $props();
    let ghostsPerColor: Record<BaseColor, number> = $derived.by(() => groupGhostsPerColor(ghosts));
    let ghostsColors: BaseColor[] = Object.keys(colors) as BaseColor[];
</script>


<div class="h-14">
    <div class="flex gap-x-8 w-fit items-center">
        {#each ghostsColors as color}
            <div class="relative">
                <img class="w-full" src={ghostsImages[color]} alt={color}>
                <Badge count={ghostsPerColor[color]} color={color}/>
            </div>
        {/each}
    </div>
</div>
