<script lang="ts">
    import type {MatrixItem, Pill, PillPosition, Rotation} from './types'
    import {pillColors, previousPills, viruses} from './game.state.svelte'
    import Pills from './pills.svelte';
    import Viruses from './viruses.svelte';
    import CurrentPill from './currentPill.svelte';
    import {getRandomColor, pillBorders} from "./utils";

    const matrix: Array<Array<MatrixItem | null>> = $state(Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => null)));

    const initialTop = 4;
    const initialLeft = 136;
    const offset = 44;
    const initialRow = 0;
    const initialColumn = 3;

    let currentRow = $state(initialRow);
    let currentColumn = $state(initialColumn);
    let rotation: Rotation = $state(0);
    let left = $state(initialLeft);
    let topCorrection = $state(0);

    let pillPosition: PillPosition = $derived.by(() => {
        if (rotation === 90) {
            return 'verticalFlipped';
        }
        if (rotation === 270) {
            return 'vertical';
        }
        return 'horizontal';
    });


    let topPosition = $derived(initialTop + (offset * currentRow) - topCorrection);

    let derivedRow = $derived.by(() => {
        if (pillPosition === 'verticalFlipped') {
            return currentRow + 1;
        }
        if (pillPosition === 'vertical') {
            return currentRow - 1;
        }
        return currentRow;
    });

    let derivedColumn = $derived.by(() => {
        if (rotation === 0) {
            return currentColumn + 1;
        }

        if (rotation === 180) {
            return currentColumn - 1
        }

        return currentColumn;
    });

    let isLastRow = $derived.by(() => {
        if (rotation === 90) {
            return (derivedRow === matrix.length - 1)
        }
        return currentRow === matrix.length - 1;
    });

    const itemBelowHelper = {
        horizontal: () => matrix[currentRow+1][currentColumn] || matrix[derivedRow+1][derivedColumn],
        vertical: () => matrix[currentRow+1][currentColumn],
        verticalFlipped: () => matrix[derivedRow+1][derivedColumn],
    }

    let isItemBelow = $derived.by(() => {
        return itemBelowHelper[pillPosition]();
    })

    let canMoveDown = $derived.by(() => {
        if (matrix[initialRow+1][initialColumn]) {
            return false;
        }

        if (isItemBelow) {
            return false;
        }

        return !isLastRow;
    });

    $effect(() => {
        console.log('Effect')
        const interval = setInterval(() => {
            if (matrix[initialRow + 1][initialColumn]) {
                clearInterval(interval);
                console.log('End')
            }

            if (currentRow === matrix.length - 1 || derivedRow === matrix.length - 1) {
                pillEnded();
            }

            moveDown();

        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    $effect(() => {
        viruses.forEach(({row, column, id, color}) => {
            matrix[row][column] = {type: 'virus', id, color};
        })
    })

    $effect(() => {
        previousPills.forEach(({row, column, id, color}) => {
            matrix[row][column] = {type: 'pill-double', id, color}
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
        const currentPill: Pill = {type: 'pill-double', id: 'pill-1', color: pillColors.current, row: currentRow, column: currentColumn, border: pillBorders[rotation].state };
        const derivedPill: Pill = {type: 'pill-double', id: 'pill-derived', color: pillColors.derived, row: derivedRow, column: derivedColumn, border: pillBorders[rotation].derived};
        previousPills.push(currentPill, derivedPill);

        currentRow = initialRow;
        currentColumn = initialColumn;
        pillColors.current = getRandomColor();
        pillColors.derived = getRandomColor();
        rotation = 0;
        topCorrection = 0;
        left = initialLeft;
    }

    const moveDown = () => {
        if (!canMoveDown) {
            pillEnded();
            return;
        }

        currentRow += 1;
    }

    const isLeftCollision = {
        0: () => matrix[currentRow][currentColumn -1],
        90: () => matrix[currentRow][currentColumn -1] || matrix[derivedRow][derivedColumn -1],
        180: () => matrix[derivedRow][derivedColumn -1],
        270: () => matrix[currentRow][currentColumn -1] || matrix[derivedRow][derivedColumn -1],
    }

    const moveLeft = () => {
        if (currentColumn === 0 || derivedColumn === 0) {
            return;
        }

        if (isLeftCollision[rotation]()) {
            return;
        }

        left -= offset;
        currentColumn -= 1;
    }

    const isRightCollision = {
        0: () => matrix[currentRow][derivedColumn +1],
        90: () => matrix[currentRow][currentColumn +1] || matrix[derivedRow][derivedColumn +1],
        180: () => matrix[derivedRow][currentColumn +1],
        270: () => matrix[currentRow][currentColumn +1] || matrix[derivedRow][derivedColumn +1],
    }

    $inspect(matrix[currentRow + 1])

    const moveRight = () => {
        if (currentColumn === 7 || derivedColumn === 7) {
            return;
        }

        if (isRightCollision[rotation]()) {
            return;
        }

        left += offset;
        currentColumn += 1;
    }

    const isRotateCollision = {
        0: () => false,
        90: () => matrix[derivedRow][derivedColumn +1] ,
        180: () => false,
        270: () => matrix[currentRow][currentColumn +1],
    }

    const rotate = () => {
        if ((currentRow === 0 && pillPosition !== 'verticalFlipped')) {
            return;
        }
        if (currentColumn === 7 && (rotation === 270 || rotation === 90)) {
            return;
        }

        if (isRotateCollision[rotation]()) {
            return;
        }

        rotationHandler[rotation]();
    }


    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'ArrowLeft') {
            moveLeft();
        }

        if (ev.key === 'ArrowRight') {
            moveRight();
        }

        if (ev.key === 'ArrowDown') {
            moveDown();
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
        <CurrentPill {topPosition} {left} {rotation}/>
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
</style>