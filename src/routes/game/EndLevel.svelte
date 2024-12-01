<script lang="ts">
    import {gameStatus, level} from "./game.state.svelte";

    let open = $derived($gameStatus === 'success' || $gameStatus === 'failure');

    const onclick = () => {
        $level++;
        $gameStatus = 'started';
    }
</script>

<dialog {open}>
    <span>Level {$level} completed!</span>
    <button {onclick}>Start next level</button>
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