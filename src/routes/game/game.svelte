<script lang="ts">
    import type {Color, MatrixItem, Pill, Rotation, Ghost} from './types'
    import {pillColors, matrix, rowsCount, colsCount, layers} from './game.state.svelte.js'
    import Pills from './pills.svelte';
    import Ghosts from './ghosts.svelte';
    import CurrentPill from './currentPill.svelte';
    import Board from './board.svelte';
    import {colors, pillBorders} from "./utils";

    const offset = 44;
    const initialRow = 0;
    const initialCol = 7;
    const gap = 4;
    const initialTop = gap;
    const initialLeft = gap + (initialCol * offset);

    const lastRow = rowsCount - 1;
    const lastCol = colsCount - 1;
    let currentPill: CurrentPill;

    let currentRow = $state(initialRow);
    let currentCol = $state(initialCol);
    let rotation: Rotation = $state(0);

    let derivedRow = $derived.by(() => {
        if (rotation === 90) {
            return currentRow + 1;
        }
        if (rotation === 270) {
            return currentRow - 1;
        }
        return currentRow;
    });

    let derivedCol = $derived.by(() => {
        if (rotation === 0) {
            return currentCol + 1;
        }

        if (rotation === 180) {
            return currentCol - 1
        }

        return currentCol;
    });

    // let ghosts: Ghost[] = $state([
    //     {type: 'ghost', color: colors.yellow, id: 'ghost-1', row: 13, column: 10},
    //     {type: 'ghost', color: colors.pink, id: 'ghost-2', row: 7, column: 6},
    //     {type: 'ghost', color: colors.blue, id: 'ghost-3', row: 9, column: 12}
    // ]);
    //
    // let previousPills: Pill[] = $state([]);

    const moveGhosts = () => {
        const ghostsToRemove: Record<string, Ghost> = {};
        layers.ghosts.forEach(ghost => {
            console.log(ghost);
            const {row, column, id} = ghost;

            // console.log(currentRow, currentCol);

            // debugger;

            if (row === initialRow) {
                ghostsToRemove[id] = ghost;
                return;
            }

            if (row - 1 === currentRow || (rotation === 90 && row -1 === derivedRow)) {
                return;
            }

            if (!matrix[row - 1][column]) {
                ghost.row = row - 1;
                matrix[row][column] = null
            } else if (!matrix[row][column + 1]) {
                ghost.column = column + 1;
                matrix[row][column + 1] = null
            } else if (!matrix[row][column - 1]) {
                ghost.column = column - 1;
                matrix[row][column - 1] = null
            } else {
                console.log('Cannot move', ghost.color)
            }

        })
    }

    $effect(() => {
        console.log('Effect')
        const currentPillInterval = setInterval(() => {
            if (matrix[initialRow + 1][initialCol]) {
                clearInterval(currentPillInterval);
                clearInterval(ghostsInterval);
            }

            moveDown();


        }, 1000);

        const ghostsInterval = setInterval(() => {
            moveGhosts()

        }, 5000);

        return () => {
            clearInterval(currentPillInterval);
            clearInterval(ghostsInterval);
        };
    });

    $effect(() => {
        layers.ghosts.forEach(({row, column, id, color}) => {
            matrix[row][column] = {type: 'ghost', id, color, row, column};
        })
    });

    const resetPill = () => {
        currentRow = initialRow;
        currentCol = initialCol;
        currentPill.reset();
    }

    const updatePreviousPills = () => {
        const currentPill: Pill = {
            type: 'pill',
            id: `pill-${currentRow}-${currentCol}`,
            color: pillColors.current,
            row: currentRow,
            column: currentCol,
            border: pillBorders[rotation].state
        };
        const derivedPill: Pill = {
            type: 'pill',
            id: `pill-${derivedRow}-${derivedCol}`,
            color: pillColors.derived,
            row: derivedRow,
            column: derivedCol,
            border: pillBorders[rotation].derived
        };
        layers.previousPills.push(currentPill, derivedPill);

        layers.previousPills.forEach(({row, column, id, color}) => {
            matrix[row][column] = {type: 'pill', id, color, row, column};
        })
    }

    const findNextMatchingItemDown = (row: number, col: number, color: Color, matchingItems: MatrixItem[]) => {
        if (row > lastRow) {
            return matchingItems;
        }
        const item = matrix[row][col];
        if (item?.color !== color) {
            return matchingItems;
        }
        matchingItems.push(item);
        return findNextMatchingItemDown(row + 1, col, color, matchingItems);
    }

    const findNextMatchingItemUp = (row: number, col: number, color: Color, matchingItems: MatrixItem[]) => {
        if (row === 1) {
            return matchingItems;
        }
        const item = matrix[row][col];
        if (item?.color !== color) {
            return matchingItems;
        }
        matchingItems.push(item);
        return findNextMatchingItemUp(row - 1, col, color, matchingItems);
    }

    const findNextMatchingItemLeft = (row: number, col: number, color: Color, matchingItems: MatrixItem[]) => {
        if (col < 0) {
            return matchingItems;
        }
        const item = matrix[row][col];
        if (item?.color !== color) {
            return matchingItems;
        }
        matchingItems.push(item);
        return findNextMatchingItemLeft(row, col - 1, color, matchingItems);
    }

    const findNextMatchingItemRight = (row: number, col: number, color: Color, matchingItems: MatrixItem[]) => {
        if (col === lastCol) {
            return matchingItems;
        }
        const item = matrix[row][col];
        if (item?.color !== color) {
            return matchingItems;
        }
        matchingItems.push(item);
        return findNextMatchingItemRight(row, col + 1, color, matchingItems);
    }

    const matchCurrentColorVertical = () => {
        const itemInMatrix = matrix[currentRow][currentCol];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemDown(currentRow + 1, currentCol, color, matchingItems);
        findNextMatchingItemUp(currentRow - 1, currentCol, color, matchingItems);

        return matchingItems;
    }

    const matchCurrentColorHorizontal = () => {
        const itemInMatrix = matrix[currentRow][currentCol];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemLeft(currentRow, currentCol - 1, color, matchingItems);
        findNextMatchingItemRight(currentRow, currentCol + 1, color, matchingItems);

        return matchingItems;
    }

    const matchDerivedColorHorizontal = () => {
        const itemInMatrix = matrix[derivedRow][derivedCol];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemLeft(derivedRow, derivedCol - 1, color, matchingItems);
        findNextMatchingItemRight(derivedRow, derivedCol + 1, color, matchingItems);

        return matchingItems;
    }

    const matchDerivedColorVertical = () => {
        const itemInMatrix = matrix[derivedRow][derivedCol];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemDown(derivedRow + 1, derivedCol, color, matchingItems);
        findNextMatchingItemUp(derivedRow - 1, derivedCol, color, matchingItems);

        return matchingItems;
    }

    const clearItems = (matchingItems: MatrixItem[]) => {
        if (matchingItems.length < 4) {
            return;
        }

        const pillsToRemove: Record<string, MatrixItem> = {};
        const ghostsToRemove: Record<string, MatrixItem> = {};

        matchingItems.forEach((item => {
            matrix[item.row][item.column] = null;
            if (item.type === 'ghost') {
                ghostsToRemove[item.id] = item;
            }
            if (item.type === 'pill') {
                pillsToRemove[item.id] = item
            }
        }))

        layers.previousPills = layers.previousPills.filter((pill) => !pillsToRemove[pill.id]);
        layers.ghosts = layers.ghosts.filter((ghost) => !ghostsToRemove[ghost.id])
    }

    const checkHorizontal = () => {
        const matchingCurrentColorVertical = matchCurrentColorVertical()
        const matchingDerivedColorVertical = matchDerivedColorVertical();

        const matchingCurrentColorHorizontal = matchCurrentColorHorizontal();
        const matchingDerivedColorHorizontal = matchDerivedColorHorizontal();

        clearItems(matchingCurrentColorVertical);
        clearItems(matchingDerivedColorVertical);
        clearItems(matchingCurrentColorHorizontal);
        clearItems(matchingDerivedColorHorizontal);
    }

    const pillEnded = () => {
        updatePreviousPills();
        checkHorizontal();
        resetPill();
    }

    const moveDown = () => {
        if (!currentPill.canMoveDown()) {
            pillEnded();
            return;
        }

        currentPill.moveDown();
    }

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'ArrowLeft') {
            currentPill.moveLeft();
        }

        if (ev.key === 'ArrowRight') {
            currentPill.moveRight();
        }

        if (ev.key === 'ArrowDown') {
            moveDown();
        }

        if (ev.key === 'ArrowUp') {
            currentPill.rotate();
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown}></svelte:window>

<div class="container">
    <div class="w-fit bg-stone-800 flex flex-nowrap flex-col gap-1 p-1 relative">
        <Board />
        <CurrentPill bind:this={currentPill} {initialTop} {initialLeft} bind:rotation bind:currentRow bind:currentCol
                     {derivedRow} {derivedCol} {lastRow} {lastCol} />
        <Ghosts {offset}/>
        <Pills {offset}/>
    </div>
</div>


<style>
    .container {
        margin-top: 50px;
        margin-left: 50px;
    }
</style>