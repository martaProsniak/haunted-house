<script lang="ts">
    import type {Matrix, MatrixItem, Plasma} from './types'
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
        score,
        gameInterval
    } from './gameState.svelte.js'
    import PlasmaLayer from './plasmaLayer.svelte';
    import GhostsLayer from './ghostsLayer.svelte';
    import FlyingPlasma from './flyingPlasma.svelte';
    import Board from './board.svelte';
    import GhostsInfo from './ghostsInfo.svelte';
    import Score from './score.svelte';
    import EndLevel from "./endLevel.svelte";
    import NextPlasma from './nextPlasma.svelte';
    import {
        generateGhosts
    } from "./utils";
    import {
        checkResult,
        clearItems,
        matchColorHorizontal,
        matchColorVertical
    } from "./matchItems.helpers";
    import {plasmaImages} from "./constants";

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

    const createPlasma = (idSuffix = '') => {
        const currentPlasma: Plasma = {
            type: 'plasma',
            id: idSuffix ? `${idSuffix}-current` : uuidv4(),
            color: flyingPlasmaColors.current,
            row: $currentRow,
            column: $currentCol,
            imageUrl: plasmaImages[flyingPlasmaColors.current],
        };
        const derivedPlasma: Plasma = {
            type: 'plasma',
            id: idSuffix ? `${idSuffix}-derived` : uuidv4(),
            color: flyingPlasmaColors.derived,
            row: $derivedRow,
            column: $derivedCol,
            imageUrl: plasmaImages[flyingPlasmaColors.derived]
        };

        return {curr: currentPlasma, der: derivedPlasma};
    }

    let plasmaInMatrix = $derived.by(() => createPlasma('plasma'));

    const matrix: Matrix = $derived.by(() => {
        console.log('Deriving')
        const matrix: Matrix = structuredClone(initialMatrix);
        layers.previousPlasma.forEach((plasma) => {
            matrix[plasma.row][plasma.column] = plasma;
        })
        layers.ghosts.forEach((ghost) => {
            matrix[ghost.row][ghost.column] = ghost;
        })
        matrix[$currentRow][$currentCol] = plasmaInMatrix.curr;
        matrix[$derivedRow][$derivedCol] = plasmaInMatrix.der;
        return matrix;
    });

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

    const resetPlasma = () => {
        currentPlasma.reset();
    }

    const prepareLevel = () => {
        prepareGhostsLayer();
        preparePlasmaLayer();
        $totalGhosts = layers.ghosts.length;
        $gameStatus = 'playing';
        $isPaused = false;
        layers.catchGhosts = {};
        layers.escapedGhosts = {};
        $totalScore+= $score;
        $score = 0;
        resetPlasma();
    }

    const prepareGhostsLayer = () => {
        layers.ghosts = generateGhosts($level);
    }

    const preparePlasmaLayer = () => {
        layers.previousPlasma = [];
    }

    const checkEndLevel = (noMoves = false) => {
        const result = checkResult(noMoves);
        if (result) {
            $gameStatus = result;
            clearInterval(plasmaInterval);
        }
    }

    const startLevel = () => {
        plasmaInterval = setInterval(() => {
            if ((matrix[initialRow][initialCol] && !matrix[initialRow][initialCol]?.id.includes('plasma')) || (matrix[initialRow][initialCol + 1] && !matrix[initialRow][initialCol + 1]?.id.includes('plasma'))) {
                console.log('Ending')
                checkEndLevel(true)
            }

            if ($isPaused) {
                return;
            }

            moveDown();

        }, $gameInterval);
    }


    const updatePreviousPlasma = () => {
        lastPlasma = createPlasma();

        layers.previousPlasma.push(lastPlasma.curr, lastPlasma.der);
    }


    const matchItemsPerRotation = {
        0: (plasma: LastPlasma) => matchItemsHorizontal(plasma),
        90: (plasma: LastPlasma) => {
            const matchingDerivedColorVertical = matchColorVertical(plasma.der.row, plasma.der.column, matrix);
            const matchingCurrentColorHorizontal = matchColorHorizontal(plasma.curr.row, plasma.curr.column, matrix);
            const matchingDerivedColorHorizontal = matchColorHorizontal(plasma.der.row, plasma.der.column, matrix);

            clearItems(matchingDerivedColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        },
        180: (plasma: LastPlasma) => matchItemsHorizontal(plasma),
        270: (plasma: LastPlasma) => {
            const matchingCurrentColorVertical = matchColorVertical(plasma.curr.row, plasma.curr.column, matrix);
            const matchingCurrentColorHorizontal = matchColorHorizontal(plasma.curr.row, plasma.curr.column, matrix);
            const matchingDerivedColorHorizontal = matchColorHorizontal(plasma.der.row, plasma.der.column, matrix);

            clearItems(matchingCurrentColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        }
    }

    const matchItemsHorizontal = (plasma: LastPlasma) => {
        const matchingCurrentColorVertical = matchColorVertical(plasma.curr.row, plasma.curr.column, matrix);
        const matchingDerivedColorVertical = matchColorVertical(plasma.der.row, plasma.der.column, matrix);

        const matchingCurrentColorHorizontal = matchColorHorizontal(plasma.curr.row, plasma.curr.column, matrix);
        const matchingDerivedColorHorizontal = matchColorHorizontal(plasma.der.row, plasma.der.column, matrix);

        clearItems(matchingCurrentColorVertical);
        clearItems(matchingDerivedColorVertical);
        clearItems(matchingCurrentColorHorizontal);
        clearItems(matchingDerivedColorHorizontal);
    }

    const plasmaEnded = () => {
        updatePreviousPlasma();
        resetPlasma();
        matchItemsPerRotation[$rotation](lastPlasma!);
        checkEndLevel();

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
        if (ev.key.startsWith('Arrow')) {
            ev.preventDefault();
        }

        if ($gameStatus !== 'playing' || $isPaused) {
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

<svelte:document on:keydown={handleKeyDown}></svelte:document>

<div class="container mx-auto h-full">
    <div class="ghosts">
        <GhostsInfo />
        <NextPlasma />
    </div>
    <div class=" w-fit h-fit bg-stone-800 flex flex-nowrap flex-col gap-1 p-1 relative board">
        <Board {matrix} />
        <FlyingPlasma bind:this={currentPlasma} {matrix} {initialTop} {initialLeft} {lastRow} {lastCol} />
        <GhostsLayer {offset} {matrix} />
        <PlasmaLayer {offset} {matrix} />
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