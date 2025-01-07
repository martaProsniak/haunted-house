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
            text-shadow: 0 0 0.3em var(--color-light), 0 2px 0.5em var(--color-medium), 0 0 0.5em var(--color-dark);
        }

        @keyframes animate {
            0%, 100% {
                transform: translateY(0);
            }
            33% {
                transform: translateY(2px) rotate(2.5deg);
            }
            66% {
                transform: translateY(-2px) rotate(-2.5deg);
            }
        }

        .move-on-hover:hover {
            animation: animate 0.5s linear infinite;
        }

        .text-spooky {
            text-shadow: 0 0 0.3em var(--color-light), 0 2px 0.5em var(--color-medium), 0 0 0.5em var(--color-dark);
            @apply text-violet-200 transition-colors inline-block;

            &:hover {
                animation: animate 0.5s linear infinite;
                color: black;
            }
        }

        .shadow-ghost {
            text-shadow: 0 2px 0.1em var(--color-pink), 0 2px 0.1em var(--color-medium), 0 2px 0.2em var(--color-blue), 0 0 0.1em var(--color-green);
        }

        .semi-transparent {
            background-color: var(--bg-color-semi-transparent);
        }

        .text-gradient {
            @apply text-transparent bg-clip-text inline-block bg-gradient-to-b from-violet-400 via-violet-600 to-violet-900
        }

        .bg-gradient {
            @apply bg-gradient-to-b from-violet-600 via-violet-700 to-violet-900
        }

        ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-color-semi-transparent);
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(var(--color-pink), var(--color-medium), var(--color-dark));
            border-radius: 12px;
            border: 1px solid var(--bg-color-semi-transparent);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: black;
        }
    }
</style>