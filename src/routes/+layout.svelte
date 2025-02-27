<script>
    import './../app.css'

    const {children} = $props();
</script>

<div class="text-blue-100 h-dvh w-dvw font-candy max-h-dvh">
    {@render children()}
</div>

<style>
    :global {
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

        .move {
            animation: animate 0.5s linear infinite;
        }

        .bg-gradient {
            @apply bg-gradient-to-r to-ghostGreen via-ghostBlue from-ghostPink
        }

        .text-spooky {
            @apply text-blue-200 transition-colors inline-block;
            text-shadow:
                    1px -1px 0 var(--color-pink),
                    -1px 1px 1px var(--color-blue),
                    -1px -1px 1px var(--color-blue),
                    1px 1px 1px var(--color-green);

            &:hover {
                animation: animate 0.5s linear infinite;
                text-shadow:
                        0 0 1px var(--color-blue)
                        -1px 1px 3px var(--color-blue),
                        1px 1px 3px var(--color-pink);
                    @apply text-transparent bg-clip-text bg-gradient-to-b from-ghostPink via-ghostBlue to-ghostGreen
            }
        }

        .text-shadow-ghost {
            text-shadow: 2px 0 2px var(--color-medium), 0 -1px 0 var(--color-green), 0 2px 0.1em var(--color-blue), -1px -1px 1px var(--color-pink);
        }

        .bg-semi-transparent {
            background-color: var(--bg-color-semi-transparent);
        }

        .text-gradient {
            @apply text-transparent bg-clip-text inline-block bg-gradient-to-b from-ghostPink via-violet-600 to-ghostBlue
        }

        .circle-gradient {
            background: rgb(236, 53, 151);
            background: radial-gradient(circle at 85% 15%, white 1px, var(--color-pink) 3%, var(--color-medium) 60%, var(--color-blue) 100%);
        }

        .shadow-gradient-ghost {
            box-shadow: -1px -1px 4px -2px var(--color-green), 1px 1px 4px 0 var(--color-blue), 4px -2px 4px -2px var(--color-pink), 0 -1px 4px 2px var(--color-blue);
        }

        ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-color-semi-transparent);
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(var(--color-pink), var(--color-blue), var(--color-green));
            border-radius: 12px;
            border: 1px solid var(--bg-color-semi-transparent);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: black;
        }
    }
</style>