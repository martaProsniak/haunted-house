<script lang="ts">
    const {offset, pills} = $props();
</script>

<div class="absolute">
    {#each pills as pill}
        <div
                style:background-color={pill.color}
                style:top={`${pill.row * offset}px`}
                style:left={`${pill.column * offset}px`}
                class={`pill-previous ${pill.border}`}>
            {pill.row}, {pill.column}
        </div>
    {/each}
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