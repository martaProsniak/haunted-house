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
        initialRow,
        isPaused,
        lastCol,
        lastRow,
        layers,
        rotation,
        equipment,
    } from './gameState.svelte.js'
    import PlasmaLayer from './plasmaLayer.svelte';
    import GhostsLayer from './ghostsLayer.svelte';
    import FlyingPlasma from './flyingPlasma.svelte';
    import Board from './board.svelte';
    import Controls from './controls.svelte';
    import GameInfo from './gameInfo.svelte';
    import RemovedLayer from './removedItems.svelte';
    import {
        checkResult,
        clearItems,
        matchColorHorizontal,
        matchColorVertical
    } from "./matchItems.helpers";
    import {plasmaImages} from "./constants";
    import {fade} from "svelte/transition";
    import {onDestroy} from "svelte";
    import {togglePause, prepareLevel, resetGame} from "./gameState.handlers.svelte.js";

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

    let showGame = $derived($gameStatus === 'started' || $gameStatus === 'playing');

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

            const isBlocked = ($currentRow === initialRow || $derivedRow === initialRow) && (layers.matrix[initialRow + 1][initialCol] || layers.matrix[initialRow + 1][initialCol + 1]);
            if (isBlocked) {
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

        if (ev.code === 'Space') {
            ev.preventDefault();
            togglePause();
        }

        if ($gameStatus !== 'playing' || $isPaused) {
            return;
        }

        if (ev.key.toLowerCase() === equipment.rainbow.key) {
            equipment.rainbow.handler();
        }

        if (ev.key.toLowerCase() === equipment.bomb.key) {
            equipment.bomb.handler();
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

<div class="wrapper">
    {#if showGame}
        <div class="container gap-x-4" in:fade={{duration: 200, delay: 200}} out:fade={{duration: 200, delay: 200}}>
            <div class="ghosts">
                <Controls/>
            </div>
            <div class=" w-fit h-fit bg-zinc-950 flex flex-nowrap flex-col gap-1 p-1 relative board">
                <Board/>
                <FlyingPlasma bind:this={currentPlasma} {initialTop} {initialLeft} {lastRow} {lastCol}/>
                <GhostsLayer {offset}/>
                <PlasmaLayer {offset}/>
                <RemovedLayer {offset}/>
            </div>
            <div class="score">
                <GameInfo/>
            </div>

        </div>
    {/if}
</div>

<style>
    .wrapper {
        max-width: 1200px;
    }

    .container {
        display: grid;
        background-color: rgba(12, 12, 13, 0.78);
        grid-template-columns: minmax(300px, 1fr) 396px minmax(300px, 1fr);
        grid-template-rows: minmax(620px, 1fr);
        grid-template-areas: 'ghosts board score';


        .ghosts {
            grid-area: ghosts;
        }

        .board {
            grid-area: board;
            box-shadow: 0 0 20px 20px #290b4038;
        }

        .score {
            grid-area: score;
        }
    }
</style>