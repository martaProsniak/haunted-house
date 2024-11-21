<script lang="ts">
    import type { MatrixItem, Pill, Rotation, Virus} from './types'
    import {colors, previousPills} from './game.state.svelte'
    import Pills from './pills.svelte';
    import Viruses from './viruses.svelte';

    const matrix: Array<Array<MatrixItem | null>> = $state(Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => null)));
    const initialTop = 4;
    const offset = 44;
    const initialRow = 0;
    const initialColumn = 3;

    let currentRow = $state(initialRow);
    let currentColumn = $state(initialColumn);

    let rotation: Rotation = $state(0);
    let pillPosition = $derived.by(() => {
        if (rotation === 90) {
            return 'vertical-bottom';
        }
        if (rotation === 270) {
            return 'vertical-top';
        }
        return 'horizontal';
    });
    let topCorrection = $state(0)
    let topPosition = $derived(initialTop + (offset * currentRow) - topCorrection);
    const initialLeft = 136;
    let left = $state(initialLeft);
    let currentColor = $state(getRandomColor());
    let derivedColor = $state(getRandomColor())

    const derivedRowHelper = {
        0: () => (currentRow),
        90: () => (currentRow + 1),
        180: () => (currentRow),
        270: () => (currentRow - 1),
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
        if (pillPosition === 'horizontal' && currentRow === matrix.length - 1) {
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

    const viruses: Virus[] = $state([
        {type: 'virus', color: colors.yellow, id: 'virus-1', row: 13, column: 4},
        {type: 'virus', color: colors.pink, id: 'virus-2', row: 7, column: 6},
        {type: 'virus', color: colors.blue, id: 'virus-3', row: 9, column: 2}
    ])

    const borderKind = {
        left: 'border-stone-800 border-y-2 border-l-2 rounded-l-2xl',
        right: 'border-stone-800 border-y-2 border-r-2 rounded-r-2xl',
        top: 'border-stone-800 border-x-2 border-t-2 rounded-t-2xl',
        bottom: 'border-stone-800 border-x-2 border-b-2 rounded-b-2xl',
    }

    const pillBorders = {
        0: {
            state: borderKind.left,
            derived: borderKind.right,
        },
        180: {
            state: borderKind.right,
            derived: borderKind.left,
        },
        270: {
            state: borderKind.bottom,
            derived: borderKind.top,
        },
        90: {
            state: borderKind.top,
            derived: borderKind.bottom,
        }
    }

    function getRandomColor() {
        return Object.values(colors)[Math.floor(Math.random() * 3)];
    }

    $effect(() => {
        console.log('Effect')
        // const interval = setInterval(() => {
        //     movePillDown();
        //
        //     if (currentRow === matrix.length - 1 || derivedRow === matrix.length - 1) {
        //         pillEnded();
        //     }
        // }, 1000);
        //
        // return () => {
        //     clearInterval(interval);
        // };
    });

    $effect(() => {
        viruses.forEach(({row, column, id, color}) => {
            matrix[row][column] = {type: 'virus', id: id, color: color};
        })
    })

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
            currentColumn += 1;
        },
        180: () => {
            rotation = 90;
            left -= (offset / 2 );
            topCorrection = -(offset / 2);
            currentRow -= 1;
            currentColumn -= 1;
        },
        90: () => {
            rotation = 0;
            left += ( offset / 2 );
            topCorrection = 0;
            currentRow += 1;
        }
    }

    const pillEnded = () => {
        const currentPill: Pill = {type: 'pill-double', id: 'pill-1', color: currentColor, row: currentRow, column: currentColumn, border: pillBorders[rotation].state };
        const derivedPill: Pill = {type: 'pill-double', id: 'pill-derived', color: derivedColor, row: derivedRow, column: derivedColumn, border: pillBorders[rotation].derived};
        previousPills.push(currentPill, derivedPill);

        currentRow = 0;
        currentColumn = initialColumn;
        currentColor = getRandomColor();
        derivedColor = getRandomColor();
        rotation = 0;
        topCorrection = 0;
        left = initialLeft;
    }

    const movePillDown = () => {
        if (!canMoveDown) {
            console.log('Cannot move down')
            return;
        }

        currentRow += 1;
    }

    const moveLeft = () => {
        if (currentColumn === 0 || derivedColumn === 0) {
            return;
        }

        left -= offset;
        currentColumn -= 1;
    }

    const moveRight = () => {
        if (currentColumn === 7 || derivedColumn === 7) {
            return;
        }

        left += offset;
        currentColumn += 1;
    }

    const rotate = () => {
        if ((currentRow === 0 && pillPosition !== 'vertical-bottom')) {
            return;
        }
        if (currentColumn === 7 && (rotation === 270 || rotation === 90)) {
            return;
        }
        rotationHandler[rotation]();
    }


    const handleKeyDown = (ev: KeyboardEvent) => {
        if (currentRow === matrix.length - 1 || derivedRow === matrix.length - 1) {
            pillEnded();
            return;
        }

        if (ev.key === 'ArrowLeft') {
            moveLeft();
        }

        if (ev.key === 'ArrowRight') {
            moveRight();
        }

        if (ev.key === 'ArrowDown') {
            movePillDown();
        }

        if (ev.key === 'ArrowUp') {
            rotate();
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown}></svelte:window>

<div class="container">
    <div class="w-fit bg-stone-800 flex flex-nowrap flex-col gap-1 p-1 relative">
        {#each matrix as row, rowIndex}
            <div class="w-fit flex flex-row flex-nowrap gap-1">
                {#each row as cell, cellIndex}
                    <div class="cell"></div>
                {/each}
            </div>
        {/each}
        <div
                style:top={`${topPosition}px`}
                style:left={`${left}px`}
                style:transform="{`rotate(${rotation}deg`}"
                class="pill">
            <div class={`pill-part-med ${borderKind.left}`} style:background-color={currentColor}></div>
            <div class="pill-part-break"></div>
            <div class={`pill-part-med ${borderKind.right}`} style:background-color={derivedColor}></div>
        </div>
        <Viruses {offset} />
        <Pills {offset} />
    </div>

</div>


<style>
    .container {
        margin-top: 50px;
        margin-left: 50px;
    }

    .cell {
        width: 40px;
        height: 40px;
        border: 2px #371d53 solid;
        box-sizing: border-box;
    }

    .pill {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 84px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;

        .pill-part-med {
            width: 40px;
        }
        .pill-part-break {
            width: 4px;
        }
    }
</style>