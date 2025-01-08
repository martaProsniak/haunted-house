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

<button {onclick} {disabled} class={`cursor-pointer btn rounded-lg py-2.5 px-2 w-full ${classes}`} class:active={active} class:shadow-gradient={!ghost}>
    {@render children()}
</button>

<style>
    .btn:hover {
        box-shadow: 0 0 0.1em 0 var(--color-light), 0 0 0.3em 0.1em var(--color-dark), 0 0 0.5em 0.1em var(--color-dark);
        background: rgb(236,53,151);
        background: linear-gradient(53deg, rgba(236,53,151,1) 0%, rgba(124,58,237,1) 63%, rgba(35,152,236,1) 100%);
    }
    .active {
        box-shadow: 0 0 0.1em 0 var(--color-pink), 0 0 0.1em 0.1em var(--color-blue), 0 0 0.5em 0.1em var(--color-dark);
        background: rgb(35,152,236);
        background: linear-gradient(53deg, rgba(35,152,236,1) 0%, rgba(124,58,237,1) 63%, rgba(236,53,151,1) 100%);
    }
</style>