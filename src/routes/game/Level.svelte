<script lang="ts">
    import {level} from "./gameState.svelte";
    import { scale} from "svelte/transition";
    import Header from "$lib/components/Header.svelte";
</script>

<div class="">
    <div>
        <Header text="Floor" />
        {#key $level}
            <p class="text-shadow-ghost" in:scale={{duration: 400}}>{$level}</p>
        {/key}
    </div>
</div>