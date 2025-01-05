<script lang="ts">
    interface Props {
        text: string,
        onclick?: () => void,
        disabled?: boolean,
        shadow?: boolean,
        classes?: string,
    }
    const {text, onclick, disabled, shadow, classes = ''}: Props = $props();
</script>

<button class={`p-3 shadow-sm shadow-violet-700 hover:bg-violet-700 focus:bg-violet-700 transition-colors rounded-lg ${classes}`}
        disabled={disabled} onclick={onclick}>
    <span class:shadow>{text}</span>
</button>

<style>
    .shadow {
        text-shadow: 0 2px 0.1em var(--color-pink), 0 2px 0.2em var(--color-blue), 0 0 0.1em var(--color-green);
    }
</style>