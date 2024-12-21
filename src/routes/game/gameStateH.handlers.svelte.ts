import {gameStatus, isPaused} from "./gameState.svelte";
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
    console.log("Starting game");
    gameStatus.set('started');
}