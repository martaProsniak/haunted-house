<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import PauseIcon from "$lib/components/icons/PauseIcon.svelte";
    import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
    import SpaceBarIcon from "$lib/components/icons/SpaceBarIcon.svelte";
    import KeyboardIcon from "$lib/components/icons/KeyboardIcon.svelte";
    import SoundOffIcon from "$lib/components/icons/SoundOffIcon.svelte";
    import SoundOnIcon from "$lib/components/icons/SoundOnIcon.svelte";
    import HauseIcon from "$lib/components/icons/HauseIcon.svelte";

    interface Props {
        onclick: () => void;
        disabled?: boolean;
        text: string;
        mainIcon: string;
        secondaryIcon: string;
    }

    const {onclick, text, disabled, mainIcon, secondaryIcon}: Props = $props();

</script>

{#snippet iconInBrackets(text: string, icon: string)}
    <div class="flex items-center justify-start gap-x-0 text-lg">
        <span class="inline-block mr-2">{text}</span>
        <span>[</span>
        {#if icon === 'space'}
            <SpaceBarIcon/>
        {:else}
            <span class="inline-block w-6 h-6 leading-6">{icon}</span>
        {/if}
        <span>]</span>
    </div>
{/snippet}

{#snippet content(icon: string)}
    {#if icon === 'play'}
        <PlayIcon/>
    {:else if icon === 'pause'}
        <PauseIcon/>
    {:else if icon === 'pad'}
        <KeyboardIcon/>
    {:else if icon === 'soundOff'}
        <SoundOffIcon/>
    {:else if icon === 'soundOn'}
        <SoundOnIcon/>
    {:else if icon === 'home'}
        <HauseIcon/>
    {/if}
    {@render iconInBrackets(text, secondaryIcon)}
{/snippet}

<div class="w-44 action-button">
    <Button {onclick} {disabled} ghost={true}>
        <div class="wrapper">
            {@render content(mainIcon)}
        </div>
    </Button>
</div>

<style>
    .wrapper {
        @apply flex items-center justify-start w-fit px-2 gap-x-2;
    }
</style>