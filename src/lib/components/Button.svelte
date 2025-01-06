<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        onclick?: () => void,
        disabled?: boolean,
        classes?: string,
        active?: boolean,
        children: any
    }
    const {children, onclick, disabled, classes = '', active}: Props = $props();
</script>

<button {onclick} {disabled}
        class="relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm rounded-md group bg-gradient group-hover:to-violet-900 group-hover:from-violet-400 group-hover:via-violet-600 hover:text-white focus:outline-none focus:ring-1 ring-violet-400">
            <span class={`relative w-full py-2 transition-all ease-in duration-75 bg-black rounded-md  group-hover:bg-opacity-0 text-base ${classes}`} class:bg-gradient={active}>
                {@render children()}
            </span>
</button>

<style>
</style>