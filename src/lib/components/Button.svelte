<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        onclick?: () => void,
        disabled?: boolean,
        classes?: string,
        active?: boolean,
        children: any,
        ghost?: boolean
    }

    const {children, onclick, disabled, classes = '', active, ghost = false}: Props = $props();
</script>

<button {onclick} {disabled} class={`cursor-pointer btn relative rounded-3xl py-2.5 px-2 w-full ${classes}`}
        class:active={active} class:shadow-gradient={!ghost}>
    {@render children()}
</button>

<style>
    .btn:hover {
        box-shadow: 0 0 0.1em 0 var(--color-light), 0 0 0.3em 0.1em var(--color-dark), 0 0 0.5em 0.1em var(--color-dark);
        background: rgb(236, 53, 151);
        background: radial-gradient(circle at 85% 15%, white 1px, var(--color-pink) 3%, var(--color-medium) 60%, var(--color-blue) 100%);
    }

    .active {
        box-shadow: 0 0 0.1em 0 var(--color-pink), 0 0 0.1em 0.1em var(--color-blue), 0 0 0.5em 0.1em var(--color-dark);
        background: rgb(35, 152, 236);
        background: radial-gradient(circle at 85% 15%, white 1px, var(--color-blue) 3%, var(--color-medium) 60%, var(--color-pink) 100%);
    }
</style>