<script lang="ts">
    import "../app.css";

    interface MatrixItem {
        type: 'pill-single' | 'pill-double' | 'virus',
        color: string,
        id: string
    }

    type Rotation = 0 | 90 | 180 | 270;

    const matrix: Array<Array<MatrixItem | null>> = $state(Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => null)));
    let currentRow = $state(0);
    let currentColumn = $state(3);
    let initialTop = 40;
    let offset = 36;
    let rotation: Rotation = $state(0);
    let pillPosition = $derived.by(() => {
        if (rotation === 90) {
            return 'vertical-top';
        }
        if (rotation === 270) {
            return 'vertical-bottom';
        }
        return 'horizontal';
    });
    let topCorrection = $state(0)
    let topPosition = $derived(initialTop + (offset * currentRow) - topCorrection);
    let left = $state(108);

    const derivedRowHelper = {
        0: () => (currentRow),
        90: () => (currentRow - 1),
        180: () => (currentRow),
        270: () => (currentRow + 1),
    }

    const deriveColumnHelper = {
        0: () => (currentColumn + 1),
        90: () => (currentColumn),
        180: () => (currentColumn - 1),
        270: () => (currentColumn),
    }

    let derivedRow = $derived.by(() => {
        return derivedRowHelper[rotation]();
    });

    let derivedColumn = $derived.by(() => {
        return deriveColumnHelper[rotation]();
    });

    let canMoveDown = $derived.by(() => {
        console.log(pillPosition)
        if (pillPosition === 'horizontal' && (currentRow === matrix.length - 1 || derivedRow === matrix.length - 1)) {
            return false;
        }

        if (pillPosition === 'vertical-top' && currentRow === matrix.length - 1) {
            return false;
        }

        if (pillPosition === 'vertical-bottom' && derivedRow === matrix.length - 1) {
            return false;
        }

        return true;
    })


    const colors = {
        pink: 'bg-pink-500',
        blue: 'bg-sky-500',
        yellow: 'bg-amber-500',
    }

    matrix[13][4] = {type: 'virus', color: colors.yellow, id: 'virus-1'};
    matrix[7][6] = {type: 'virus', color: colors.pink, id: 'virus-2'};
    matrix[9][2] = {type: 'virus', color: colors.blue, id: 'virus-3'};


    function getRandomColor() {
        return Object.values(colors)[Math.floor(Math.random() * 3)];
    }

    $effect(() => {
        console.log('Effect')
        // const interval = setInterval(() => {
        //     console.log('Current row:', currentRow);
        //     console.log('Current column', currentColumn);
        //     movePillDown();
        //
        //     if (currentRow === matrix.length - 1) {
        //         clearInterval(interval)
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
            left += ( offset / 2 );
            topCorrection = 0;
        },
        180: () => {
            rotation = 90;
            left -= (offset / 2 );
            topCorrection = (offset / 2);
        },
        90: () => {
            rotation = 0;
            left += ( offset / 2 );
            topCorrection = 0;
        }
    }

    const movePillDown = () => {
        console.log(canMoveDown)
        if (!canMoveDown) {
            return;
        }

        currentRow += 1;
    }


    const handleKeyDown = (ev: KeyboardEvent) => {


        if (ev.key === 'ArrowLeft') {
            if (currentColumn === 0 || derivedColumn === 0) {
                return;
            }

            left -= offset;
            currentColumn -= 1;
        }

        if (ev.key === 'ArrowRight') {
            if (currentColumn === 7 || derivedColumn === 7) {
                return;
            }

            left += offset;
            currentColumn += 1;
        }

        if (ev.key === 'ArrowDown') {
            movePillDown();
        }

        if (ev.key === 'ArrowUp') {
            if (currentRow === matrix.length - 1 || currentRow === 0) {
                return;
            }
            rotationHandler[rotation]();

        }
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
