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
        totalGhosts,
        totalScore,
        score
    } from './game.state.svelte.js'
    import PlasmaLayer from './plasmaLayer.svelte';
    import GhostsLayer from './ghostsLayer.svelte';
    import FlyingPlasma from './flyingPlasma.svelte';
    import Board from './board.svelte';
    import GhostsInfo from './ghostsInfo.svelte';
    import Score from './score.svelte';
    import EndLevel from "./endLevel.svelte";
    import {
        generateGhosts,
        plasmaImages
    } from "./utils";
    import {
        checkResult,
        clearItems,
        matchColorHorizontal,
        matchColorVertical
    } from "./matchItems.helpers";

    const offset = 44;
    const gap = 4;
    const initialTop = gap;
    const initialLeft = gap + (initialCol * offset);

    let currentPlasma: FlyingPlasma;
    let plasmaInterval: ReturnType<typeof setInterval>;

    $effect(() => {
        if ($gameStatus === 'started') {
            prepareLevel();
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

    const updateMatrix = () => {
        layers.matrix.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const plasma = layers.previousPlasma.find((plasma) => plasma.row === rowIndex && plasma.column === cellIndex);
                if (plasma) {
                    layers.matrix[rowIndex][cellIndex] = plasma;
                    return;
                }
                const ghost = layers.ghosts.find((ghost) => ghost.row === rowIndex && ghost.column === cellIndex);
                if (ghost) {
                    layers.matrix[rowIndex][cellIndex] = ghost;
                    return;
                }
                layers.matrix[rowIndex][cellIndex] = null;
            })
        })
    }

    $effect(() => {
        updateMatrix();
    });

    const resetPlasma = () => {
        $currentRow = initialRow;
        $currentCol = initialCol;
        currentPlasma.reset();
    }

    const prepareLevel = () => {
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
        $totalScore+= $score;
        $score = 0;
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


    const matchItemsPerRotation = {
        0: () => matchItemsHorizontal(),
        90: () => {
            const matchingDerivedColorVertical = matchColorVertical($derivedRow, $derivedCol);
            const matchingCurrentColorHorizontal = matchColorHorizontal($currentRow, $currentCol);
            const matchingDerivedColorHorizontal = matchColorHorizontal($derivedRow, $derivedCol);

            clearItems(matchingDerivedColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        },
        180: () => matchItemsHorizontal(),
        270: () => {
            const matchingCurrentColorVertical = matchColorVertical($currentRow, $currentCol);
            const matchingCurrentColorHorizontal = matchColorHorizontal($currentRow, $currentCol);
            const matchingDerivedColorHorizontal = matchColorHorizontal($derivedRow, $derivedCol);

            clearItems(matchingCurrentColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        }
    }

    const matchItemsHorizontal = () => {
        const matchingCurrentColorVertical = matchColorVertical($currentRow, $currentCol);
        const matchingDerivedColorVertical = matchColorVertical($derivedRow, $derivedCol);

        const matchingCurrentColorHorizontal = matchColorHorizontal($currentRow, $currentCol);
        const matchingDerivedColorHorizontal = matchColorHorizontal($derivedRow, $derivedCol);

        clearItems(matchingCurrentColorVertical);
        clearItems(matchingDerivedColorVertical);
        clearItems(matchingCurrentColorHorizontal);
        clearItems(matchingDerivedColorHorizontal);
    }

    const plasmaEnded = () => {
        updatePreviousPlasma();
        matchItemsPerRotation[$rotation]();
        const result = checkResult();
        if (result) {
            $gameStatus = result;
        }
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