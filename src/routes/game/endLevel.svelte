<script lang="ts">
    import {gameStatus, level} from "./gameState.svelte.js";

    const onclick = () => {
        if ($gameStatus === 'success') {
            $level++;
        }
        $gameStatus = 'started';
    }
</script>

{#snippet success()}
    <span>Level {$level} completed!</span>
    <button {onclick}>Start next level</button>
{/snippet}

{#snippet failure()}
    <span>You lost!</span>
    <button {onclick}>Restart level {$level}</button>
{/snippet}


<dialog open={$gameStatus === 'success' || $gameStatus === 'failure'}>
    {#if $gameStatus === 'success'}
        {@render success()}
    {/if}
    {#if $gameStatus === 'failure'}
        {@render failure()}
    {/if}
</dialog>

<style>
    dialog {
        width: 400px;
        height: 400px;
        z-index: 20;
        border: 4px black solid;
        border-radius: 8px;
    }
</style>