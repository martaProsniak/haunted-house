<script lang="ts">
    import {level, maxFloor} from "./gameState.svelte";
    import { scale} from "svelte/transition";
    import Header from "$lib/components/Header.svelte";
</script>

<div class="flex items-center gap-x-10">
    <div class="">
        <Header text="Floor" />
        {#key $level}
            <p class="text-shadow-ghost" in:scale={{duration: 400}}>{$level}</p>
        {/key}
    </div>
    <div class="w-[4px] h-[4px] shadow-gradient-ghost rounded-full inline-block bg-gradient border-none"></div>
    <div>
        <Header text="Best" />
        <p class="text-shadow-ghost">{$maxFloor}</p>
    </div>
</div>