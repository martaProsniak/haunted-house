<script lang="ts">
    import {level} from "./gameState.svelte";
    import {fly, scale} from "svelte/transition";
</script>

<div class="">
    <div>Level:
        {#key $level}
            <p in:scale={{duration: 400}}>{$level}</p>
        {/key}
    </div>
</div>