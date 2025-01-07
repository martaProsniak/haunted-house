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
        volume
    } from './gameState.svelte.js'
    import PlasmaLayer from './PlasmaLayer.svelte';
    import GhostsLayer from './GhostsLayer.svelte';
    import FlyingBullet from './FlyingBullet.svelte';
    import Board from './Board.svelte';
    import Controls from './Controls.svelte';
    import GameInfo from './GameInfo.svelte';
    import RemovedLayer from './RemovedItemsLayer.svelte';
    import {
        checkResult,
        clearItems,
        matchColorHorizontal,
        matchColorVertical
    } from "./matchItems.helpers";
    import {plasmaImages} from "./constants";
    import {fade} from "svelte/transition";
    import {onDestroy} from "svelte";
    import {togglePause, prepareLevel, resetGame} from "./gameState.helpers.svelte.js";
    import music from '$lib/assets/game.mp3';
    import {GameAudio} from "./GameAudio.svelte.js";

    interface LastBullet {
        curr: Plasma;
        der: Plasma;
    }

    const offset = 44;
    const gap = 4;
    const initialTop = gap;
    const initialLeft = gap + (initialCol * offset);

    let lastBullet: LastBullet | null = $state(null);
    let currentBullet: FlyingBullet;

    let animationFrameId: number | null = null;
    let lastFrameTime: number | null = null;

    const audio = new GameAudio(music, true);

    const stopAudio = () => {
        audio?.reset();
    }

    $effect(() => {
        audio.setVolume($volume);
    })

    $effect(() => {
        updateMatrix();
    });

    $effect(() => {
        if ($gameStatus === 'started') {
            prepareLevel();
            audio?.start();
        }

        if ($gameStatus === 'playing') {
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(animateLevel);
            }
        }

        if ($gameStatus === 'success' || $gameStatus === 'failure') {
            stopAudio();
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
        stopAudio();
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

    const resetBullet = () => {
        $currentRow = initialRow;
        $currentCol = initialCol;
        currentBullet.reset();
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

        lastBullet = {curr: currentPlasma, der: derivedPlasma};

        return lastBullet;
    }

    const updatePreviousPlasma = () => {
        lastBullet = createLastPlasma();

        layers.previousPlasma.push(lastBullet.curr, lastBullet.der);

        layers.previousPlasma.forEach((plasma) => {
            layers.matrix[plasma.row][plasma.column] = plasma;
        })
    }

    const matchItemsPerRotation = {
        0: (plasma: LastBullet) => matchItemsHorizontal(plasma),
        90: (plasma: LastBullet) => {
            const matchingDerivedColorVertical = matchColorVertical(plasma.der.row, plasma.der.column);
            const matchingCurrentColorHorizontal = matchColorHorizontal(plasma.curr.row, plasma.curr.column);
            const matchingDerivedColorHorizontal = matchColorHorizontal(plasma.der.row, plasma.der.column);

            clearItems(matchingDerivedColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        },
        180: (plasma: LastBullet) => matchItemsHorizontal(plasma),
        270: (plasma: LastBullet) => {
            const matchingCurrentColorVertical = matchColorVertical(plasma.curr.row, plasma.curr.column);
            const matchingCurrentColorHorizontal = matchColorHorizontal(plasma.curr.row, plasma.curr.column);
            const matchingDerivedColorHorizontal = matchColorHorizontal(plasma.der.row, plasma.der.column);

            clearItems(matchingCurrentColorVertical);
            clearItems(matchingCurrentColorHorizontal);
            clearItems(matchingDerivedColorHorizontal);
        }
    }

    const matchItemsHorizontal = (plasma: LastBullet) => {
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
        resetBullet();
        matchItemsPerRotation[$rotation](lastBullet!);
        checkEndLevel();

    }

    const moveDown = () => {

        if (!currentBullet.canMoveDown()) {
            plasmaEnded();
            return;
        }

        currentBullet.moveDown();

        if (!currentBullet.canMoveDown()) {
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
            return;
        }

        if (ev.key.toLowerCase() === equipment.bomb.key) {
            equipment.bomb.handler();
            return;
        }

        if (ev.key === 'ArrowLeft') {
            currentBullet.moveLeft();
            return;
        }

        if (ev.key === 'ArrowRight') {
            currentBullet.moveRight();
            return;
        }

        if (ev.key === 'ArrowDown') {
            moveDown();
            return;
        }

        if (ev.key === 'ArrowUp') {
            currentBullet.rotate();
            return;
        }
    }
</script>

<svelte:document on:keydown={handleKeyDown}></svelte:document>

<div class="wrapper mx-auto overflow-auto">
    <div class="container px-4 gap-x-4 py-10 overflow-auto" in:fade={{duration: 200, delay: 200}} out:fade={{duration: 200, delay: 200}}>
        <div class="ghosts">
            <Controls/>
        </div>
        <div class=" w-fit h-fit bg-zinc-950 flex flex-nowrap flex-col gap-1 p-1 relative board">
            <Board/>
            <FlyingBullet bind:this={currentBullet} {initialTop} {initialLeft} {lastRow} {lastCol}/>
            <GhostsLayer {offset}/>
            <PlasmaLayer {offset}/>
            <RemovedLayer {offset}/>
        </div>
        <div class="score">
            <GameInfo/>
        </div>
    </div>
</div>

<style>
    .wrapper {
        max-width: 1200px;
    }

    .container {
        display: grid;
        background-color: rgba(0, 0, 0, 0.95);
        grid-template-columns: minmax(260px, 1fr) 396px minmax(300px, 1fr);
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