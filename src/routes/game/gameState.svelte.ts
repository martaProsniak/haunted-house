import { derived, type Readable, type Writable, writable } from 'svelte/store';
import { getRandomColor } from './utils';
import type {GameLayers, GameStatus, Rotation} from './types';

// Constants
export const flyingPlasmaColors = $state({
	current: getRandomColor(),
	derived: getRandomColor()
});

export const nextPlasmaColors = $state({
	current: getRandomColor(),
	derived: getRandomColor()
});
export const rowsCount = 16;
export const colsCount = 16;
export const initialRow = 0;
export const initialCol = 7;
export const lastRow = rowsCount - 1;
export const lastCol = colsCount - 1;

// Stores
export const currentRow: Writable<number> = writable(initialRow);
export const currentCol: Writable<number> = writable(initialCol);
export const rotation: Writable<Rotation> = writable(0);
export const gameStatus: Writable<GameStatus> = writable('not-started');
export const level: Writable<number> = writable(0);
export const isPaused: Writable<boolean> = writable(false);
export const score: Writable<number> = writable(0);
export const totalScore: Writable<number> = writable(0);
export const totalGhosts: Writable<number> = writable(0);

export const derivedRow: Readable<number> = derived(
	[rotation, currentRow],
	([$rotation, $currentRow]) => {
		if ($rotation === 90) {
			return $currentRow + 1;
		}
		if ($rotation === 270) {
			return $currentRow - 1;
		}
		return $currentRow;
	}
);

export const derivedCol: Readable<number> = derived(
	[rotation, currentCol],
	([$rotation, $currentCol]) => {
		if ($rotation === 0) {
			return $currentCol + 1;
		}

		if ($rotation === 180) {
			return $currentCol - 1;
		}

		return $currentCol;
	}
);

// State
export const initialMatrix = Array.from(Array(rowsCount).keys()).map(() => Array.from(Array(colsCount).keys()).map(() => null));


export const layers: GameLayers = $state({
	matrix: initialMatrix,
	ghosts: [],
	previousPlasma: [],
	escapedGhosts: {},
	catchGhosts: {},
	equipment: [],
	removedItems: {},
});

