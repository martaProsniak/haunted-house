<script lang="ts">
    import {score} from "./gameState.svelte";
    import {fly, scale} from "svelte/transition";
</script>

<div class="">
    <div>Score:
        {#key $score}
            <p in:scale={{duration: 400}}>{$score}</p>
        {/key}
    </div>
</div>