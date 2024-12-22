import {
    gameStatus,
    isPaused,
    layers,
    lives,
    initialLives,
    level,
    rotation,
    currentRow,
    currentCol,
    totalGhosts,
    score,
    equipmentThisLevel,
    initialRow, initialCol, initialMatrix, totalScore
} from "./gameState.svelte";
import {get} from "svelte/store";
import {generateGhosts} from "./utils";

export const pauseGame = () => {
    if (get(gameStatus) !== 'playing') return;
    isPaused.set(true)
}

export const unpauseGame = () => {
    if (get(gameStatus) !== 'playing') return;
    isPaused.set(false)
}

export const togglePause = () => {
    if (get(gameStatus) === 'not-started') return;
    isPaused.set(!get(isPaused))
}

export const startGame = () => {
    gameStatus.set('started');
    isPaused.set(false);
    lives.set(initialLives);
    score.set(0);
    level.set(1);
    totalScore.set(0);
}

const prepareGhostsLayer = () => {
    layers.ghosts = generateGhosts(get(level));
}

const preparePlasmaLayer = () => {
    layers.previousPlasma = [];
}

export const prepareLevel = () => {
    prepareGhostsLayer();
    preparePlasmaLayer();
    rotation.set(0);
    currentRow.set(initialRow);
    currentCol.set(initialCol);
    layers.matrix = initialMatrix;
    layers.catchGhosts = {};
    layers.removedItems = {};
    equipmentThisLevel.rainbow.count = 0;
    equipmentThisLevel.bomb.count = 0;
    gameStatus.set('playing');
    isPaused.set(false);
}

export const resetGame = () => {
    layers.matrix = initialMatrix;
    layers.ghosts = [];
    layers.catchGhosts = {};
    layers.removedItems = {};
    gameStatus.set('not-started');
    score.set(0);
    isPaused.set(false);
    lives.set(initialLives);
}

export const restartLevel = () => {
    gameStatus.set('started');
    isPaused.set(false);
    score.set(0);
}