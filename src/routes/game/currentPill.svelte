<script lang="ts">
    import {borderKind} from "$lib/game/utils";
    import {pillColors} from "$lib/game/game.state.svelte.js";

    const {topPosition, left, rotation, currentRow, currentColumn, derivedRow, derivedColumn} = $props();

</script>

<div
        style:top={`${topPosition}px`}
        style:left={`${left}px`}
        style:transform="{`rotate(${rotation}deg`}"
        class="pill">
    <div class={`pill-part-med ${borderKind.left}`} style:background-color={pillColors.current}>M {currentRow} {currentColumn}</div>
    <div class="pill-part-break"></div>
    <div class={`pill-part-med ${borderKind.right}`} style:background-color={pillColors.derived}>D {derivedRow} {derivedColumn}</div>
</div>

<style>
    .pill {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 84px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;

        .pill-part-med {
            width: 40px;
        }
        .pill-part-break {
            width: 4px;
        }
    }
</style>