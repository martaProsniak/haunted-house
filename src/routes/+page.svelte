<script lang="ts">
    import "../app.css";

    const rows = $state(Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => '')));
    let selectedRowIndex = $state(0);
    let selectedCellIndex = $state(4);
    let pillPosition: 'h-default' | 'v-up' | 'h-flipped' | 'v-down' = 'h-default'
    let position: 'vertical' | 'horizontal' = $state("horizontal");
    let initialTop = 4;
    let offset = 36;
    let rotation = $state(0);
    let topCorrection = $state(0)
    let topPosition = $derived(initialTop + (offset * selectedRowIndex) - topCorrection);
    let left = $state(108);

    const pillBorderClasses = {
        'h-left': 'border-none border-stone-950 border-y-2 border-l-2 rounded-l-lg',
        'h-right': 'border-none border-stone-950 border-y-2 border-r-2 rounded-r-lg',
        'v-up': 'border-none border-stone-950 border-x-2 border-t-2 rounded-t-lg',
        'v-down': 'border-none border-stone-950 border-x-2 border-b-2 rounded-b-lg',
    }

    const colorClasses = {
        pink: 'bg-pink-500',
        blue: 'bg-sky-500',
        yellow: 'bg-amber-500',
    }

    rows[13][4] = `virus rounded-full ${colorClasses.yellow}`;
    rows[7][6] = `virus rounded-full ${colorClasses.pink}`;
    rows[9][2] = `virus rounded-full ${colorClasses.blue}`;


    // setInterval(() => {
    //     selectedRowIndex += 1;
    //     if (selectedRowIndex === rows.length - 1) {
    //         selectedRowIndex = 0;
    //     }
    // }, 1000)

    $effect(() => {
        // const interval = setInterval(() => {
        //     selectedRowIndex += 1;
        //     if (selectedRowIndex === rows.length - 1) {
        //         selectedRowIndex = 0;
        //     }
        // }, 1000);
        //
        // return () => {
        //     clearInterval(interval);
        // };
    });

    const rotationHandler: Record<number, () => void> = {
        0: () => {
            rotation = 270;
            left -= (offset / 2 );
            topCorrection = offset / 2;
        },
        270: () => {
            rotation = 180;
            left -= ( offset / 2 );
            topCorrection = 0;
        },
        180: () => {
            rotation = 90;
            left += (offset / 2 );
            topCorrection = -(offset / 2);
        },
        90: () => {
            rotation = 0;
            left += ( offset / 2 );
            topCorrection = 0;
        }
    }

    const handleKeyDown = (ev: KeyboardEvent) => {
        console.log(ev)
        if (ev.key === 'ArrowLeft') {
            left -= offset;
        }

        if (ev.key === 'ArrowRight') {
            left += offset;
        }

        if (ev.key === 'ArrowDown') {
            if (selectedRowIndex > 0) {
                selectedRowIndex += 1;
            }
        }

        if (ev.key === 'ArrowUp') {
            rotationHandler[rotation]();

            if (position === 'horizontal') {
                position = 'vertical';
            } else {
                position = 'horizontal'
            }
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown}></svelte:window>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div class="container">
    <div class="w-fit flex flex-nowrap flex-col gap-1 p-1 relative bg-stone-950">
        {#each rows as row, rowIndex}
            <div class="w-fit flex flex-row flex-nowrap gap-1">
                {#each row as cell, cellIndex}
                    <div class={`cell ${cell}`}></div>
                {/each}
            </div>
        {/each}
    </div>

</div>

<style>
    .container {
        margin-top: 50px;
        margin-left: 50px;
    }
</style>
