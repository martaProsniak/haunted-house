<script lang="ts">
    import {fly} from 'svelte/transition'

    let {open, handleClose, handleConfirm} = $props();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            handleClose();
        }

        if (e.key.toLowerCase() === "b") {
            handleConfirm();
        }
    }

</script>

<svelte:document on:keydown={handleKeyDown}></svelte:document>

{#snippet button(onclick: () => void, text: String, key: String)}
    <button class="text-spooky p-1 space-y-1" onclick={onclick}>
        <span class="inline-block w-full">{text}</span>
        <span class="inline-block text-base">[{key}]</span>
    </button>
{/snippet}

{#if open}
    <dialog class="h-full w-full text-xl px-4 py-20 flex items-center justify-center text-blue-200 bg-darkViolet" {open}
            in:fly={{duration: 200, y: -200}} out:fly={{duration: 200, y: -200}}>
        <button class="text-right py-4 px-6 outline-violet-600 hover:bg-black cursor-pointer rounded-bl-lg absolute top-0 right-0"
                onclick={handleClose}>
            X
        </button>
        <div class="w-full space-y-6 text-center">
            <div class="space-y-2">
                <p>Job in progress!</p>
                <p>Are you sure you want to leave?</p>
            </div>
            <div class="flex justify-evenly flex-nowrap">
                {@render button(handleClose, 'Stay in', 'Esc')}
                {@render button(handleConfirm, 'Go back', ' b ')}
            </div>
        </div>
    </dialog>
{/if}

<style>
    dialog {
        z-index: 45;
        border: 4px black solid;
        border-radius: 8px;
    }
</style>