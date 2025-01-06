<script>
    import './../app.css'

    const {children} = $props();
</script>

<div class="text-violet-200 h-screen w-screen font-candy flex items-center justify-center py-16 max-h-screen overflow-hidden">
    {@render children()}
</div>

<style>
    :global {
        .shadow {
            text-shadow: 0 2px 0.1em var(--color-light), 0 2px 0.2em var(--color-medium), 0 0 0.1em var(--color-dark);
        }

        .semi-transparent {
            background-color: var(--bg-color-semi-transparent);
        }

        .text-gradient {
            @apply text-transparent bg-clip-text inline-block bg-gradient-to-b from-violet-400 via-violet-600 to-violet-900
        }

        .bg-gradient {
            @apply bg-gradient-to-b from-violet-400 via-violet-600 to-violet-900
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-color-semi-transparent);
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(var(--color-light), var(--color-medium), var(--color-dark));
            border-radius: 12px;
            border: 2px solid var(--bg-color-semi-transparent);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: black;
        }
    }
</style>