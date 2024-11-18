<script lang="ts">
    import "../app.css";

    interface MatrixItem {
        pillBorder?: string,
        color: string,
        virus?: string,
    }

    type PillPosition = 'hDefault' | 'vUp' | 'hFlipped' | 'vDown'

    const matrix: Array<Array<MatrixItem | null>> = $state(Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => null)));
    let pillPosition: PillPosition = $state('hDefault');
    let currentRow = $state(0);
    let currentCell = $state(4);
    let flippedRow: number | 'none' = $state('none');
    let flippedCell: number | 'none' = $state('none');

    const derivedRowHelper = {
        hDefault: () => (currentRow),
        vUp: () => (currentRow - 1),
        hFlipped: () => (currentRow),
        vDown: () => (currentRow + 1),
    }

    const deriveCellHelper = {
        hDefault: () => (currentCell + 1),
        vUp: () => (currentCell),
        hFlipped: () => (currentCell - 1),
        vDown: () => (currentCell),
    }

    let derivedRow = $derived.by(() => {
        if (flippedRow === 'none') {
            return derivedRowHelper[pillPosition]();
        }
        return flippedRow;
    });

    let derivedCell = $derived.by(() => {
        if (flippedCell === 'none') {
            return deriveCellHelper[pillPosition]();
        }

        return flippedCell;
    });


    const borderKind = {
        left: 'border-none border-stone-950 border-y-2 border-l-2 rounded-l-lg',
        right: 'border-none border-stone-950 border-y-2 border-r-2 rounded-r-lg',
        top: 'border-none border-stone-950 border-x-2 border-t-2 rounded-t-lg',
        bottom: 'border-none border-stone-950 border-x-2 border-b-2 rounded-b-lg',
    }

    const pillBorders = {
        hDefault: {
            state: borderKind.left,
            derived: borderKind.right,
        },
        hFlipped: {
            state: borderKind.right,
            derived: borderKind.left,
        },
        vUp: {
            state: borderKind.bottom,
            derived: borderKind.top,
        },
        vDown: {
            state: borderKind.top,
            derived: borderKind.bottom,
        }
    };

    const colors = {
        pink: 'bg-pink-500',
        blue: 'bg-sky-500',
        yellow: 'bg-amber-500',
    }

    matrix[13][4] = {virus: 'virus rounded-full', color: colors.yellow};
    matrix[7][6] = {virus: 'virus rounded-full', color: colors.pink};
    matrix[9][2] = {virus: 'virus rounded-full', color: colors.blue};

    function resetFlippedRow () {
        flippedRow = 'none';
    }

    function resetFlippedCell () {
        flippedCell = 'none';
    }


    const clearCell = (row: number, cell: number) => {
        matrix[row][cell] = null
    }

    $effect(() => {
        matrix[currentRow][currentCell] = {pillBorder: pillBorders[pillPosition].state, color: colors.pink};
        matrix[derivedRow][derivedCell] = {pillBorder: pillBorders[pillPosition].derived, color: colors.yellow}

        // const interval = setInterval(() => {
        //
        //     currentRow += 1;
        //     clearCell(currentRow - 1, currentCell);
        //     clearCell(currentRow - 1, currentCell + 1);
        //     if (currentRow === matrix.length - 1) {
        //         currentRow = 0;
        //     }
        // }, 1000);
        //
        // return () => {
        //     clearInterval(interval);
        // };
    });


    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'ArrowLeft') {
            if (currentCell === 0 || derivedCell === 0) {
                return;
            }

            resetFlippedRow();
            resetFlippedCell();

            if (pillPosition === 'hDefault') {
                currentCell -= 1;
                clearCell(currentRow, derivedCell + 1);
            }
            if (pillPosition === 'vUp') {
                currentCell -= 1;
                clearCell(currentRow, currentCell + 1);
                clearCell(derivedRow, currentCell + 1);
            }
        }

        if (ev.key === 'ArrowRight') {
            if (currentCell === 7 || derivedCell === 7) {
                return;
            }

            resetFlippedRow();
            resetFlippedCell();

            if (pillPosition === 'hDefault') {
                currentCell += 1;
                clearCell(currentRow, currentCell - 1);
            }
            if (pillPosition === 'vUp') {
                currentCell += 1;
                clearCell(currentRow, currentCell - 1);
                clearCell(derivedRow, derivedCell - 1);
            }

        }

        if (ev.key === 'ArrowDown') {
            if (currentRow === matrix.length - 1 || derivedRow === matrix.length - 1) {
                return;
            }

            resetFlippedRow();
            resetFlippedCell();

            if (pillPosition === 'hDefault') {
                currentRow += 1;
                clearCell(currentRow - 1, currentCell);
                clearCell(currentRow - 1, currentCell + 1);
            }
            if (pillPosition === 'vUp') {
                currentRow += 1;
                clearCell(derivedRow - 1, derivedCell);
            }
        }

        if (ev.key === 'ArrowUp') {
            if (pillPosition === 'hDefault') {
                flippedRow = currentRow - 1;
                flippedCell = currentCell;
                clearCell(currentRow, currentCell + 1);
                pillPosition = 'vUp'
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
