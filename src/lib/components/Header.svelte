<script lang="ts">
    const {text, shadow = true, large = false} = $props();
</script>

<div class="w-fit">
    <h2 class="font-bold text-shadow-ghost"
        class:text-outline={shadow}
        class:text-violet-300={!shadow}
        class:text-3xl={large}
        class:text-xl={!large}
        class:mb-6={large}
    >
            {text}
    </h2>
</div>