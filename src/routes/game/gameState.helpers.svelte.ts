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
	score,
	initialRow,
	initialCol,
	initialMatrix,
	totalScore,
	equipment,
	bestScore,
	maxFloor,
	volume
} from './gameState.svelte';
import { get } from 'svelte/store';
import { generateGhosts } from './utils';
import { clearEquipmentThisLevel, increaseEquipment } from './equipment.helpers.svelte';

export const pauseGame = () => {
	if (get(gameStatus) !== 'playing') return;
	isPaused.set(true);
	if (get(volume) === 0) return;
	volume.set(0.3);
};

export const unpauseGame = () => {
	if (get(gameStatus) !== 'playing') return;
	isPaused.set(false);
	if (get(volume) === 0) return;
	volume.set(1);
};

export const togglePause = () => {
	if (get(gameStatus) === 'not-started') return;
	if (get(isPaused)) {
		unpauseGame();
		return;
	}
	pauseGame();
};

export const startGame = () => {
	gameStatus.set('started');
	isPaused.set(false);
	lives.set(initialLives);
	score.set(0);
	level.set(1);
	totalScore.set(0);
	equipment.rainbow.count = 1;
	equipment.bomb.count = 1;
};

const prepareGhostsLayer = () => {
	layers.ghosts = generateGhosts(get(level));
};

const preparePlasmaLayer = () => {
	layers.previousPlasma = [];
};

export const prepareLevel = () => {
	prepareGhostsLayer();
	preparePlasmaLayer();
	rotation.set(0);
	currentRow.set(initialRow);
	currentCol.set(initialCol);
	layers.matrix = initialMatrix;
	layers.catchGhosts = {};
	layers.removedItems = {};
	increaseEquipment();
	clearEquipmentThisLevel();
	gameStatus.set('playing');
	isPaused.set(false);
	score.set(0);
};

export const resetGame = () => {
	layers.matrix = initialMatrix;
	layers.ghosts = [];
	layers.catchGhosts = {};
	layers.removedItems = {};
	gameStatus.set('not-started');
	score.set(0);
	isPaused.set(false);
	lives.set(initialLives);
};

export const progressLevel = () => {
	level.set(get(level)+1);
	updateLocalData();
	gameStatus.set('started');
}

export const restartLevel = () => {
	gameStatus.set('started');
	isPaused.set(false);
	totalScore.set(get(totalScore) - get(score));
	score.set(0);
	lives.set(initialLives);
};

export const muteAudio = () => {
	volume.set(0);
};

export const enableAudio = () => {
	if (get(isPaused)) {
		volume.set(0.5);
		return;
	}
	volume.set(1);
};

export const toggleSound = () => {
	get(volume) > 0 ? muteAudio() : enableAudio();
};

export const setLocalData = (score: number, floor: number) => {
	score && bestScore.set(score);
	floor && maxFloor.set(floor);
};

export const updateBestScore = () => {
	const total = get(totalScore);
	const best = get(bestScore);

	if (total <= best) {
		return;
	}

	localStorage.setItem('bestScore', total.toString());
	bestScore.set(total);
}

export const updateMaxFloor = () => {
	const current = get(level);
	const best = get(maxFloor);

	if (current <= best) {
		return;
	}

	localStorage.setItem('maxFloor', current.toString());
	maxFloor.set(current);
}

export const updateLocalData = () => {
	updateBestScore();
	updateMaxFloor();
}
