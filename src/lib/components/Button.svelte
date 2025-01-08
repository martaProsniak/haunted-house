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

<button {onclick} {disabled} class={`cursor-pointer btn relative rounded-3xl py-2.5 px-2 w-full shadow-gradient-light ${classes}`}
        class:active={active}>
    {@render children()}
</button>

<style>
    .btn {
        transition: all 0.2s linear;
    }
    .btn:hover {
        color: black;
        box-shadow: 1px -1px 1px 0 black;
        transform: scale(1.05) rotate(-2.5deg);
        background: rgb(236, 53, 151);
        background: radial-gradient(circle at 85% 15%, white 1px, var(--color-pink) 3%, var(--color-medium) 60%, var(--color-blue) 100%);
    }

    .active {
        color: black;
        box-shadow: 1px -1px 1px 0 black;
        transform: scale(1.05) rotate(2.5deg);
        background: rgb(35, 152, 236);
        background: radial-gradient(circle at 85% 15%, white 1px, var(--color-blue) 3%, var(--color-medium) 60%, var(--color-pink) 100%);
    }


</style>