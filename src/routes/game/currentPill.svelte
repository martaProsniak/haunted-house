<script lang="ts">
    import {borderKind} from "./utils";
    import {pillColors} from "./game.state.svelte";

    const {topPosition, left, rotation} = $props();

</script>

<div
        style:top={`${topPosition}px`}
        style:left={`${left}px`}
        style:transform="{`rotate(${rotation}deg`}"
        class="pill">
    <div class={`pill-part-med ${borderKind.left}`} style:background-color={pillColors.current}>M</div>
    <div class="pill-part-break"></div>
    <div class={`pill-part-med ${borderKind.right}`} style:background-color={pillColors.derived}></div>
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

        .pill-part-med {
            width: 40px;
        }
        .pill-part-break {
            width: 4px;
        }
    }
</style>