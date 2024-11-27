<script lang="ts">
    import type {Color} from "./types";

    interface Props {
        offset: number,
        color: Color,
        row: number,
        column: number
        imageUrl: string
    }

    const {color, row, column, offset, imageUrl}: Props = $props()
</script>

<div
        style:background-image={`url("${imageUrl}")`}
        style:top={`${row * offset}px`}
        style:left={`${column * offset}px`}
        class="plasma-previous">
    {row}, {column}
</div>

<style>
    .plasma-previous {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;
    }
</style>