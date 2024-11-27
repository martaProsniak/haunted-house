<script lang="ts">
    import type {Color, MatrixItem, Plasma} from './types'
    import { v4 as uuidv4 } from "uuid";
    import {flyingPlasmaColors, matrix, layers, initialCol, initialRow, lastCol, lastRow, currentCol, currentRow, derivedRow, derivedCol} from './game.state.svelte.js'
    import PlasmaLayer from './plasmaLayer.svelte';
    import GhostsLayer from './ghostsLayer.svelte';
    import FlyingPlasma from './flyingPlasma.svelte';
    import Board from './board.svelte';
    import {plasmaImages} from "./utils";

    const offset = 44;
    const gap = 4;
    const initialTop = gap;
    const initialLeft = gap + (initialCol * offset);

    let currentPlasma: FlyingPlasma;

    $effect(() => {
        console.log('Effect')
        const currentPlasmaInterval = setInterval(() => {
            if (matrix[initialRow + 1][initialCol]) {
                clearInterval(currentPlasmaInterval);
            }

            moveDown();

        }, 1000);
    });

    $effect(() => {
        layers.ghosts.forEach(({row, column, id, color, imageUrl}) => {
            matrix[row][column] = {type: 'ghost', id, color, row, column, imageUrl};
        })
    });

    const resetPlasma = () => {
        $currentRow = initialRow;
        $currentCol = initialCol;
        currentPlasma.reset();
    }

    const updatePreviousPlasma = () => {
        const currentPlasma: Plasma = {
            type: 'plasma',
            id: uuidv4(),
            color: flyingPlasmaColors.current,
            row: $currentRow,
            column: $currentCol,
            imageUrl: plasmaImages[flyingPlasmaColors.current]
        };
        const derivedPlasma: Plasma = {
            type: 'plasma',
            id: uuidv4(),
            color: flyingPlasmaColors.derived,
            row: $derivedRow,
            column: $derivedCol,
            imageUrl: plasmaImages[flyingPlasmaColors.derived]
        };
        layers.previousPlasma.push(currentPlasma, derivedPlasma);

        layers.previousPlasma.forEach(({row, column, id, color, imageUrl}) => {
            matrix[row][column] = {type: 'plasma', id, color, row, column, imageUrl};
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
        const itemInMatrix = matrix[$currentRow][$currentCol];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemDown($currentRow + 1, $currentCol, color, matchingItems);
        findNextMatchingItemUp($currentRow - 1, $currentCol, color, matchingItems);

        return matchingItems;
    }

    const matchCurrentColorHorizontal = () => {
        const itemInMatrix = matrix[$currentRow][$currentCol];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemLeft($currentRow, $currentCol - 1, color, matchingItems);
        findNextMatchingItemRight($currentRow, $currentCol + 1, color, matchingItems);

        return matchingItems;
    }

    const matchDerivedColorHorizontal = () => {
        const itemInMatrix = matrix[$derivedRow][$derivedCol];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemLeft($derivedRow, $derivedCol - 1, color, matchingItems);
        findNextMatchingItemRight($derivedRow, $derivedCol + 1, color, matchingItems);

        return matchingItems;
    }

    const matchDerivedColorVertical = () => {
        const itemInMatrix = matrix[$derivedRow][$derivedCol];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemDown($derivedRow + 1, $derivedCol, color, matchingItems);
        findNextMatchingItemUp($derivedRow - 1, $derivedCol, color, matchingItems);

        return matchingItems;
    }

    const clearItems = (matchingItems: MatrixItem[]) => {
        if (matchingItems.length < 4) {
            return;
        }

        const plasmaToRemove: Record<string, MatrixItem> = {};
        const ghostsToRemove: Record<string, MatrixItem> = {};

        matchingItems.forEach((item => {
            matrix[item.row][item.column] = null;
            if (item.type === 'ghost') {
                ghostsToRemove[item.id] = item;
            }
            if (item.type === 'plasma') {
                plasmaToRemove[item.id] = item
            }
        }))

        layers.previousPlasma = layers.previousPlasma.filter((plasma) => !plasmaToRemove[plasma.id]);
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

    const plasmaEnded = () => {
        updatePreviousPlasma();
        checkHorizontal();
        resetPlasma();
    }

    const moveDown = () => {
        if (!currentPlasma.canMoveDown()) {
            plasmaEnded();
            return;
        }

        currentPlasma.moveDown();
    }

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'ArrowLeft') {
            currentPlasma.moveLeft();
        }

        if (ev.key === 'ArrowRight') {
            currentPlasma.moveRight();
        }

        if (ev.key === 'ArrowDown') {
            moveDown();
        }

        if (ev.key === 'ArrowUp') {
            currentPlasma.rotate();
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown}></svelte:window>

<div class="container">
    <div class="w-fit bg-stone-800 flex flex-nowrap flex-col gap-1 p-1 relative">
        <Board />
        <FlyingPlasma bind:this={currentPlasma} {initialTop} {initialLeft} {lastRow} {lastCol} />
        <GhostsLayer {offset} />
        <PlasmaLayer {offset}/>
    </div>
</div>


<style>
    .container {
        margin-top: 50px;
        margin-left: 50px;
    }
</style>