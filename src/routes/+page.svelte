<script lang="ts">
    import "../app.css";

    interface MatrixItem {
        pillBorder?: string,
        color: string,
        virus?: string,
    }

    const matrix: Array<Array<MatrixItem | null>> = $state(Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => null)));
    const statePill = $state({row: 0, cell: 4});
    let pillPosition: 'hDefault' | 'vUp' | 'hFlipped' | 'vDown' = $state('hDefault');
    const derivedPillPositionHelper = {
        hDefault: () => ({row: statePill.row, cell: statePill.cell + 1}),
        vUp: () => ({row: statePill.row - 1, cell: statePill.cell}),
        hFlipped: () => ({row: statePill.row, cell: statePill.cell - 1}),
        vDown: () => ({row: statePill.row + 1, cell: statePill.cell}),
    }

    let derivedPill = $derived.by(() => {
        return derivedPillPositionHelper[pillPosition]();
    })


    const pillBorderClasses = {
        'h-left': 'border-none border-stone-950 border-y-2 border-l-2 rounded-l-lg',
        'h-right': 'border-none border-stone-950 border-y-2 border-r-2 rounded-r-lg',
        'v-up': 'border-none border-stone-950 border-x-2 border-t-2 rounded-t-lg',
        'v-down': 'border-none border-stone-950 border-x-2 border-b-2 rounded-b-lg',
    }

    const colors = {
        pink: 'bg-pink-500',
        blue: 'bg-sky-500',
        yellow: 'bg-amber-500',
    }

    matrix[13][4] = {virus: 'virus rounded-full', color: colors.yellow};
    matrix[7][6] = {virus: 'virus rounded-full', color: colors.pink};
    matrix[9][2] = {virus: 'virus rounded-full', color: colors.blue};


    const clearCell = (row: number, cell: number) => {
        matrix[row][cell] = null
    }

    $effect(() => {
        // matrix[statePill.row][statePill.cell] = `${pillBorderClasses['h-left']} ${colors.yellow}`;
        matrix[statePill.row][statePill.cell] = {
            pillBorder: pillBorderClasses['h-left'],
            color: colors.yellow,
        };
        matrix[derivedPill.row][derivedPill.cell] = {
            pillBorder: pillBorderClasses['h-right'],
            color: colors.pink,
        };
        // matrix[derivedPill.row][derivedPill.cell] = `${pillBorderClasses['h-right']} ${colors.pink}`;
        // const interval = setInterval(() => {
        //     matrix[statePill.row][statePill.cell] = ``;
        //     matrix[derivedPill.row][derivedPill.cell] = ``;
        //     statePill.row += 1;
        //     matrix[statePill.row][statePill.cell] = `${pillBorderClasses['h-left']} ${colors.yellow}`;
        //     matrix[derivedPill.row][derivedPill.cell] = `${pillBorderClasses['h-right']} ${colors.pink}`;
        //     console.log(matrix[statePill.row][statePill.cell])
        //     if (statePill.row === matrix.length - 1) {
        //         statePill.row = 0;
        //     }
        // }, 1000);
        //
        // return () => {
        //     clearInterval(interval);
        // };
    });


    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'ArrowLeft') {
            console.log('Arrow left')
            if (statePill.cell === 0 || derivedPill.cell === 0) {
                return;
            }
            if (pillPosition === 'hDefault') {
                statePill.cell -= 1;
                matrix[statePill.row][statePill.cell + 2] = null;
            }
        }

        if (ev.key === 'ArrowRight') {
            if (statePill.cell === 7 || derivedPill.cell === 7) {
                return;
            }
            if (pillPosition === 'hDefault') {
                statePill.cell += 1;
                matrix[statePill.row][statePill.cell - 1] = null;
            }
        }

        if (ev.key === 'ArrowDown') {
            if (statePill.row < matrix.length - 1) {
                matrix[statePill.row][statePill.cell] = null;
                matrix[derivedPill.row][derivedPill.cell] = null;
                statePill.row += 1;
            }
        }

        if (ev.key === 'ArrowUp') {
            if (pillPosition === 'hDefault') {
                pillPosition = 'vUp';

            }
        }
    }

    const getCellClasses = (row: number, cell: number) => {
        const classes: MatrixItem | null = matrix[row][cell];
        if (!classes) {
            return '';
        }
        return Object.values(classes).reduce((acc, current) => {
            return acc + ' ' + current;
        }, '')
    }
</script>

<svelte:window on:keydown={handleKeyDown}></svelte:window>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div class="container">
    <div class="w-fit flex flex-nowrap flex-col gap-1 p-1 relative bg-stone-950">
        {#each matrix as row, rowIndex}
            <div class="w-fit flex flex-row flex-nowrap gap-1">
                {#each row as cell, cellIndex}
                    <div class={`cell ${getCellClasses(rowIndex, cellIndex)}`}></div>
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

    .cell {
        width: 32px;
        height: 32px;
        border: none;
        box-sizing: border-box;
    }

</style>
