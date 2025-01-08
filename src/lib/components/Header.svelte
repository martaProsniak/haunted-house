<script lang="ts">
    const {text, shadow = true} = $props();
</script>

<div class="w-fit">
    <h2 class="text-xl font-bold shadow" class:text-outline={shadow} class:text-violet-300={!shadow}>{text}</h2>
</div>