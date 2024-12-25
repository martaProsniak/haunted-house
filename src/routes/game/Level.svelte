<script lang="ts">
    import {level} from "./gameState.svelte";
    import { scale} from "svelte/transition";
</script>

<div class="">
    <div>Floor:
        {#key $level}
            <p in:scale={{duration: 400}}>{$level}</p>
        {/key}
    </div>
</div>