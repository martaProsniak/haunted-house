import {gameStatus, isPaused, layers, lives, initialLives} from "./gameState.svelte";
import {get} from "svelte/store";

export const pauseGame = () => {
    if (get(gameStatus) === 'not-started') return;
    isPaused.set(true)
}

export const togglePause = () => {
    if (get(gameStatus) === 'not-started') return;
    isPaused.set(!get(isPaused))
}

export const startGame = () => {
    gameStatus.set('started');
    isPaused.set(false);
    lives.set(initialLives)
}