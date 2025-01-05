<script lang="ts">
    interface Props {
        text: string,
        onclick?: () => void,
        disabled?: boolean,
        classes?: string,
    }
    const {text, onclick, disabled, classes = ''}: Props = $props();
</script>

<button {onclick} {disabled}
        class="relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm rounded-full group bg-gradient-to-b to-violet-800 via-violet-500 from-violet-400 group-hover:to-violet-800 group-hover:from-violet-400 group-hover:via-violet-500 hover:text-white focus:outline-none focus:ring-2">
            <span class={`relative w-full py-3 transition-all ease-in duration-75 bg-black rounded-full  group-hover:bg-opacity-0 text-lg ${classes}`}>
                {text}
            </span>
</button>

<style>
</style>