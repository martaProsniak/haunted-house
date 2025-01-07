<script lang="ts">
    const {text, shadow = false} = $props();
</script>

<div class="w-fit">
    <h2 class="text-xl font-bold text-outline" class:shadow={shadow} class:text-violet-300={!shadow}>{text}</h2>
</div>