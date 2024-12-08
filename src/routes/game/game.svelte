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

    interface LastPlasma {
        curr: Plasma;
        der: Plasma;
    }

    const offset = 44;
    const gap = 4;
    const initialTop = gap;
    const initialLeft = gap + (initialCol * offset);
    let lastPlasma: LastPlasma | null = $state(null);

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
        layers.catchGhosts = {};
        layers.escapedGhosts = {};
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
            if (layers.matrix[initialRow + 1][initialCol] || layers.matrix[initialRow + 1][initialCol + 1]) {
                const result = checkResult(true);
                if (result) {
                    $gameStatus = result;
                    clearInterval(plasmaInterval);
                }
            }

            if ($isPaused) {
                return;
            }

            moveDown();

        }, 1000);
    }

    const createLastPlasma = () => {
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

        lastPlasma = {curr: currentPlasma, der: derivedPlasma};

        return lastPlasma;
    }


    const updatePreviousPlasma = () => {
        lastPlasma = createLastPlasma();

        layers.previousPlasma.push(lastPlasma.curr, lastPlasma.der);

        layers.previousPlasma.forEach((plasma) => {
            layers.matrix[plasma.row][plasma.column] = plasma;
        })
    }


    const matchItemsPerRotation = {
        0: (plasma: LastPlasma) => matchItemsHorizontal(plasma),
        90: (plasma: LastPlasma) => {
            const matchingDerivedColorVertical = matchColorVertical(plasma.der.row, plasma.der.column);
            const matchingCurrentColorHorizontal = matchColorHorizontal(plasma.curr.row, plasma.curr.column);
            const matchingDerivedColorHorizontal = matchColorHorizontal(plasma.der.row, plasma.der.column);

            clearItems(matchingDerivedColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        },
        180: (plasma: LastPlasma) => matchItemsHorizontal(plasma),
        270: (plasma: LastPlasma) => {
            const matchingCurrentColorVertical = matchColorVertical(plasma.curr.row, plasma.curr.column);
            const matchingCurrentColorHorizontal = matchColorHorizontal(plasma.curr.row, plasma.curr.column);
            const matchingDerivedColorHorizontal = matchColorHorizontal(plasma.der.row, plasma.der.column);

            clearItems(matchingCurrentColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        }
    }

    const matchItemsHorizontal = (plasma: LastPlasma) => {
        const matchingCurrentColorVertical = matchColorVertical(plasma.curr.row, plasma.curr.column);
        const matchingDerivedColorVertical = matchColorVertical(plasma.der.row, plasma.der.column);

        const matchingCurrentColorHorizontal = matchColorHorizontal(plasma.curr.row, plasma.curr.column);
        const matchingDerivedColorHorizontal = matchColorHorizontal(plasma.der.row, plasma.der.column);

        clearItems(matchingCurrentColorVertical);
        clearItems(matchingDerivedColorVertical);
        clearItems(matchingCurrentColorHorizontal);
        clearItems(matchingDerivedColorHorizontal);
    }

    const plasmaEnded = () => {
        updatePreviousPlasma();
        resetPlasma();
        matchItemsPerRotation[$rotation](lastPlasma!);
        const result = checkResult();
        if (result) {
            $gameStatus = result;
        }

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
        if ($gameStatus !== 'playing' || $isPaused) {
            return;
        }

        if (ev.key === 'ArrowLeft') {
            ev.preventDefault();
            currentPlasma.moveLeft();
        }

        if (ev.key === 'ArrowRight') {
            ev.preventDefault();
            currentPlasma.moveRight();
        }

        if (ev.key === 'ArrowDown') {
            ev.preventDefault();
            moveDown();
        }

        if (ev.key === 'ArrowUp') {
            ev.preventDefault();
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