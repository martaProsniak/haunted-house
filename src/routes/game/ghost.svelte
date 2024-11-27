<script lang="ts">
    const {color, row, column, offset, imageUrl} = $props();
    console.log(color)
</script>

<div
        class="ghost"
        style:background-image={`url("${imageUrl}")`}
        style:top={`${row * offset}px`}
        style:left={`${column * offset}px`}
></div>

<style>
    .ghost {
        /*border: 4px black solid;*/
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
    }
</style>