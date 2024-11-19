<script lang="ts">
    import "../app.css";

    interface MatrixItem {
        type: 'pill-single' | 'pill-double' | 'virus',
        color: string
    }

    type Rotation = 0 | 90 | 180 | 270;

    type PillPosition = 'hDefault' | 'vUp' | 'hFlipped' | 'vDown'

    const matrix: Array<Array<MatrixItem | null>> = $state(Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => null)));
    let currentRow = $state(0);
    let currentCell = $state(3);
    let initialTop = 40;
    let offset = 36;
    let rotation: Rotation = $state(0);
    let topCorrection = $state(0)
    let topPosition = $derived(initialTop + (offset * currentRow) - topCorrection);
    let left = $state(108);

    const derivedRowHelper = {
        0: () => (currentRow),
        90: () => (currentRow - 1),
        180: () => (currentRow),
        270: () => (currentRow + 1),
    }

    const deriveCellHelper = {
        0: () => (currentCell + 1),
        90: () => (currentCell),
        180: () => (currentCell - 1),
        270: () => (currentCell),
    }

    let derivedRow = $derived.by(() => {
        return derivedRowHelper[rotation]();
    });

    let derivedCell = $derived.by(() => {
        return deriveCellHelper[rotation]();
    });


    const colors = {
        pink: 'bg-pink-500',
        blue: 'bg-sky-500',
        yellow: 'bg-amber-500',
    }

    matrix[13][4] = {type: 'virus', color: colors.yellow};
    matrix[7][6] = {type: 'virus', color: colors.pink};
    matrix[9][2] = {type: 'virus', color: colors.blue};


    function getRandomColor() {
        return Object.values(colors)[Math.floor(Math.random() * 3)];
    }

    $effect(() => {
        const interval = setInterval(() => {

            movePillDown();
            console.log(currentRow)
            console.log(currentCell)
        }, 1000);

        return () => {
            clearInterval(interval);
        };
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

    const movePillDown = () => {
        if (currentRow === matrix.length - 1 || derivedRow === matrix.length - 1) {
            return;
        }

        currentRow += 1;
    }


    const handleKeyDown = (ev: KeyboardEvent) => {


        if (ev.key === 'ArrowLeft') {
            if (currentCell === 0 || derivedCell === 0) {
                return;
            }

            left -= offset;
            currentCell -= 1;
        }

        if (ev.key === 'ArrowRight') {
            if (currentCell === 7 || derivedCell === 7) {
                return;
            }

            left += offset;
            currentCell += 1;
        }

        if (ev.key === 'ArrowDown') {
            movePillDown();
        }

        if (ev.key === 'ArrowUp') {
            if (currentRow === matrix.length - 1) {
                return;
            }
            rotationHandler[rotation]();

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
    <div
            style:top={`${topPosition}px`}
            style:left={`${left}px`}
            style:transform="{`rotate(${rotation}deg`}"
            class="pill">
        <div class="pill-part-pink"></div>
        <div class="pill-part-break"></div>
        <div class="pill-part-yellow"></div>
    </div>
    <div>

    </div>
    <div class="w-fit bg-orange-300 flex flex-nowrap flex-col gap-1 p-1 relative">
        {#each matrix as row, rowIndex}
            <div class="w-fit flex flex-row flex-nowrap gap-1">
                {#each row as cell, cellIndex}
                    <div class="cell"></div>
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
        background-color: salmon;
    }

    .pill {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        border-radius: 10px;
        border: 4px black solid;
        width: 76px;
        height: 40px;
        position: relative;
        z-index: 10;
        box-sizing: border-box;

        .pill-part-pink {
            background-color: hotpink;
            width: 32px;
        }
        .pill-part-break {
            background-color: black;
            width: 4px;
        }
        .pill-part-yellow {
            background-color: yellow;
            width: 32px;
        }
    }

</style>
