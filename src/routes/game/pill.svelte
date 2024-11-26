<script lang="ts">
    const {color, row, column, border, offset} = $props()
</script>

<div
        style:background-color={color}
        style:top={`${row * offset}px`}
        style:left={`${column * offset}px`}
        class={`pill-previous ${border}`}>
    {row}, {column}
</div>

<style>
    .pill-previous {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;
    }
</style>