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
            text-shadow: 0 2px 0.1em var(--color-pink), 0 2px 0.2em var(--color-blue), 0 0 0.1em var(--color-green);
        }

        .semi-transparent {
            background-color: var(--bg-color-semi-transparent);
        }

        .text-gradient {
            @apply text-transparent bg-clip-text inline-block bg-gradient-to-r from-ghostPink via-ghostBlue to-ghostGreen
        }

        .bg-gradient {
            @apply bg-gradient-to-r from-ghostPink via-ghostBlue to-ghostGreen
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-color-semi-transparent);
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(var(--color-pink), var(--color-blue), var(--color-green));
            border-radius: 12px;
            border: 2px solid var(--bg-color-semi-transparent);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: black;
        }
    }
</style>