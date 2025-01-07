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

<button {onclick} {disabled} class={`cursor-pointer btn rounded-lg py-2.5 px-2 w-full ${classes}`} class:active={active} class:btn-shadow={!ghost}>
    {@render children()}
</button>

<style>
    .btn-shadow {
        box-shadow: 0 0 0.1em 0 var(--color-medium), 0 0 0.3em 0.1em var(--color-medium), 0 0 0.5em 0.1em var(--color-dark);
        transition: all .2s ease-in;
    }
    .btn:hover {
        background: rgb(167,139,250);
        box-shadow: 0 0 0.1em 0 var(--color-medium), 0 0 0.3em 0.1em var(--color-dark), 0 0 0.5em 0.1em var(--color-dark);
        background: linear-gradient(180deg, rgba(167,139,250,1) 0%, rgba(124,58,237,1) 34%, rgba(76,29,149,1) 82%, rgba(2,0,36,1) 030402%);
    }
    .active {
        background: rgb(167,139,250);
        box-shadow: 0 0 0.1em 0 var(--color-medium), 0 0 0.3em 0.1em var(--color-dark), 0 0 0.5em 0.1em var(--color-dark);
        background: linear-gradient(180deg, rgba(167,139,250,1) 0%, rgba(124,58,237,1) 34%, rgba(76,29,149,1) 82%, rgba(2,0,36,1) 030402%);
    }
</style>