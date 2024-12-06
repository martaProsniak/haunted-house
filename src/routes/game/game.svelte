<script lang="ts">
    import type {MatrixItem, Plasma} from './types'
    import {v4 as uuidv4} from "uuid";
    import {
        currentCol,
        currentRow,
        derivedCol,
        derivedRow,
        flyingPlasmaColors,
        gameStatus,
        initialCol,
        initialGhostsSummary,
        initialMatrix,
        initialRow,
        isPaused,
        lastCol,
        lastRow,
        layers,
        level,
        rotation,
        totalGhosts
    } from './game.state.svelte.js'
    import PlasmaLayer from './plasmaLayer.svelte';
    import GhostsLayer from './ghostsLayer.svelte';
    import FlyingPlasma from './flyingPlasma.svelte';
    import Board from './board.svelte';
    import GhostsInfo from './ghostsInfo.svelte';
    import Score from './score.svelte';
    import EndLevel from "./EndLevel.svelte";
    import {
        findNextMatchingItemDown,
        findNextMatchingItemLeft,
        findNextMatchingItemRight,
        findNextMatchingItemUp,
        generateGhosts,
        plasmaImages
    } from "./utils";

    const offset = 44;
    const gap = 4;
    const initialTop = gap;
    const initialLeft = gap + (initialCol * offset);

    let currentPlasma: FlyingPlasma;
    let plasmaInterval: ReturnType<typeof setInterval>;

    $effect(() => {
        if ($gameStatus === 'started') {
            prepareGame();
        }

        if ($gameStatus === 'playing') {
            startLevel();
        }

        if ($gameStatus === 'success' || $gameStatus === 'failure') {
            clearInterval(plasmaInterval);
        }

        return () => {
            if (plasmaInterval) {
                console.log('clear interval');
                clearInterval(plasmaInterval);
            }
        }
    });

    $effect(() => {
        layers.ghosts.forEach(({row, column, id, color, imageUrl}) => {
            layers.matrix[row][column] = {type: 'ghost', id, color, row, column, imageUrl};
        })
    });

    const resetPlasma = () => {
        $currentRow = initialRow;
        $currentCol = initialCol;
        currentPlasma.reset();
    }

    const prepareGame = () => {
        prepareGhostsLayer();
        preparePlasmaLayer();
        $rotation = 0;
        layers.matrix = initialMatrix;
        $currentRow = initialRow;
        $currentCol = initialCol;
        $totalGhosts = layers.ghosts.length;
        $gameStatus = 'playing';
        $isPaused = false;
        layers.catchGhosts = initialGhostsSummary;
        layers.escapedGhosts = initialGhostsSummary;
    }

    const prepareGhostsLayer = () => {
        layers.ghosts = generateGhosts($level);
    }

    const preparePlasmaLayer = () => {
        layers.previousPlasma = [];
    }

    const startLevel = () => {
        plasmaInterval = setInterval(() => {
            if (layers.matrix[initialRow][initialCol] || layers.matrix[initialRow][initialCol + 1]) {
                checkResult();
            }

            if ($isPaused) {
                return;
            }

            moveDown();

        }, 1000);
    }


    const updatePreviousPlasma = () => {
        const currentPlasma: Plasma = {
            type: 'plasma',
            id: uuidv4(),
            color: flyingPlasmaColors.current,
            row: $currentRow,
            column: $currentCol,
            imageUrl: plasmaImages[flyingPlasmaColors.current],
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

        layers.previousPlasma.forEach((plasma) => {
            layers.matrix[plasma.row][plasma.column] = plasma;
        })
    }

    const matchCurrentColorVertical = () => {
        const itemInMatrix = layers.matrix[$currentRow][$currentCol];
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
        const itemInMatrix = layers.matrix[$currentRow][$currentCol];
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
        const itemInMatrix = layers.matrix[$derivedRow][$derivedCol];
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
        const itemInMatrix = layers.matrix[$derivedRow][$derivedCol];
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
            layers.matrix[item.row][item.column] = null;
            if (item.type === 'ghost') {
                ghostsToRemove[item.id] = item;
            }
            if (item.type === 'plasma') {
                plasmaToRemove[item.id] = item
            }
        }))

        layers.previousPlasma = layers.previousPlasma.filter((plasma) => !plasmaToRemove[plasma.id]);
        layers.ghosts = layers.ghosts.filter((ghost) => !ghostsToRemove[ghost.id]);
        countCatchGhosts(ghostsToRemove);

        if (layers.ghosts.length) {
            return;
        }

        checkResult();
    }

    const checkResult = () => {
        const anyGhostCatch = Object.values(layers.catchGhosts).some((value) => value > 0);
        $gameStatus = anyGhostCatch ? 'success' : 'failure';

    }

    const countCatchGhosts = (ghosts: Record<string, MatrixItem>) => {
        Object.values(ghosts).forEach((ghost) => {
            layers.catchGhosts[ghost.color]++
        })
    }

    const matchItemsPerRotation = {
        0: () => matchItemsHorizontal(),
        90: () => {
            const matchingDerivedColorVertical = matchDerivedColorVertical();
            const matchingCurrentColorHorizontal = matchCurrentColorHorizontal();
            const matchingDerivedColorHorizontal = matchDerivedColorHorizontal();

            clearItems(matchingDerivedColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        },
        180: () => matchItemsHorizontal(),
        270: () => {
            const matchingCurrentColorVertical = matchCurrentColorVertical();
            const matchingCurrentColorHorizontal = matchCurrentColorHorizontal();
            const matchingDerivedColorHorizontal = matchDerivedColorHorizontal();

            clearItems(matchingCurrentColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        }
    }

    const matchItemsHorizontal = () => {
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
        matchItemsPerRotation[$rotation]();
        resetPlasma();
    }

    const moveDown = () => {

        if (!currentPlasma.canMoveDown()) {
            plasmaEnded();
            return;
        }

        currentPlasma.moveDown();

        if (!currentPlasma.canMoveDown()) {
            plasmaEnded();
            return;
        }
    }

    const handleKeyDown = (ev: KeyboardEvent) => {
        ev.preventDefault();

        if ($gameStatus !== 'playing') {
            return;
        }

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

<div class="container mx-auto h-full">
    <div class="ghosts">
        <GhostsInfo />
    </div>
    <div class=" w-fit h-fit bg-stone-800 flex flex-nowrap flex-col gap-1 p-1 relative board">
        <Board />
        <FlyingPlasma bind:this={currentPlasma} {initialTop} {initialLeft} {lastRow} {lastCol} />
        <GhostsLayer {offset} />
        <PlasmaLayer {offset}/>
    </div>
    <div class="score">
        <Score />
    </div>
    <EndLevel />
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: minmax(300px, 1fr) 708px minmax(300px, 1fr);
        grid-template-rows: minmax(708px, 1fr);
        grid-template-areas: 'ghosts board score';
        align-items: center;

        .ghosts {
            grid-area: ghosts;
        }

        .board {
            grid-area: board;
        }

        .score {
            grid-area: score;
        }
    }
</style>