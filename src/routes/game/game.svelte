<script lang="ts">
    import type {Plasma} from './types'
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
    } from './gameState.svelte.js'
    import PlasmaLayer from './plasmaLayer.svelte';
    import GhostsLayer from './ghostsLayer.svelte';
    import FlyingPlasma from './flyingPlasma.svelte';
    import Board from './board.svelte';
    import Controls from './controls.svelte';
    import GameInfo from './gameInfo.svelte';
    import EndLevel from "./endLevel.svelte";
    import RemovedLayer from './removedItems.svelte';
    import WelcomeModal from './welcomeModal.svelte';
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
    import {fade} from "svelte/transition";
    import {onDestroy} from "svelte";

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

    let animationFrameId: number | null = null;
    let lastFrameTime: number | null = null;

    let showWelcomeModal = $state(true);

    const startGame = () => {
        showWelcomeModal = false;
        $gameStatus = 'started';
    }

    $effect(() => {
        updateMatrix();
    });

    $effect(() => {
        if ($gameStatus === 'started') {
            prepareLevel();
        }

        if ($gameStatus === 'playing') {
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(animateLevel);
            }
        }

        if ($gameStatus === 'success' || $gameStatus === 'failure') {
            if (animationFrameId !== null) {
                cancelAnimation();
            }
        }

        return () => {
            if (animationFrameId !== null) {
                cancelAnimation();
            }
        };
    });

    onDestroy(() => {
        resetGame();
    })

    const cancelAnimation = () => {
        if (animationFrameId === null) {
            return;
        }
        cancelAnimationFrame(animationFrameId);
        lastFrameTime = null;
        animationFrameId = null;
    }

    const animateLevel = (currentTime: number) => {
        if (!lastFrameTime) {
            lastFrameTime = currentTime;
        }

        const delta = currentTime - lastFrameTime;

        if ($gameStatus === 'playing' && delta >= 1000) {
            if (layers.matrix[initialRow + 1][initialCol] || layers.matrix[initialRow + 1][initialCol + 1]) {
                checkEndLevel(true);
            }

            if (!$isPaused) {
                moveDown();
            }

            lastFrameTime = currentTime;
        }

        if ($gameStatus === 'playing') {
            animationFrameId = requestAnimationFrame(animateLevel);
        }
    };

    const resetGame = () => {
        layers.matrix = initialMatrix;
        layers.ghosts = [];
        layers.escapedGhosts = {};
        layers.catchGhosts = {};
        layers.removedItems = {};
        $gameStatus = 'not-started';
        $score = 0;
    }


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
        layers.removedItems = {};
        $score = 0;
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
            animationFrameId && cancelAnimation();
        }
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

<div class="container h-full gap-x-20">
    <div class="ghosts">
        <Controls />
    </div>
        <div class=" w-fit h-fit bg-zinc-950 flex flex-nowrap flex-col gap-1 p-1 relative board" in:fade={{duration: 200}}>
            <Board />
            <FlyingPlasma bind:this={currentPlasma} {initialTop} {initialLeft} {lastRow} {lastCol} />
            <GhostsLayer {offset} />
            <PlasmaLayer {offset}/>
            <RemovedLayer {offset} />
        </div>
    <div class="score">
        <GameInfo />
    </div>
    <EndLevel />
    {#if showWelcomeModal}
        <WelcomeModal {startGame} />
    {/if}
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: 300px minmax(396px, 1fr) 300px;
        grid-template-rows: minmax(620px, 1fr);
        grid-template-areas: 'ghosts board score';
        align-items: center;

        .ghosts {
            grid-area: ghosts;
        }

        .board {
            grid-area: board;
            box-shadow: 0 0 20px 20px #3a3340;
        }

        .score {
            grid-area: score;
        }
    }
</style>