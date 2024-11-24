<script lang="ts">
    const {offset, viruses} = $props();
</script>

<div class="absolute">
    {#each viruses as virus}
        <div
                class="virus"
                style:background-color={virus.color}
                style:top={`${virus.row * offset}px`}
                style:left={`${virus.column * offset}px`}
        ></div>
    {/each}
</div>

<style>
    .virus {
        border: 4px black solid;
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
    }
</style>