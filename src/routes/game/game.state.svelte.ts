import { derived, type Readable, type Writable, writable } from 'svelte/store';
import { colors, getRandomColor, ghostsImages } from './utils';
import type { GameLayers, GameStatus, Ghost, Matrix, Rotation } from './types';

// Constants
export const flyingPlasmaColors = $state({
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
export const level: Writable<number> = writable(1);

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
const initialGhosts: Ghost[] = [
	{ type: 'ghost', color: colors.green, id: 'ghost-1', row: 13, column: 10, imageUrl: ghostsImages.green },
	{ type: 'ghost', color: colors.pink, id: 'ghost-2', row: 12, column: 6, imageUrl: ghostsImages.pink },
	{ type: 'ghost', color: colors.blue, id: 'ghost-3', row: 9, column: 12, imageUrl: ghostsImages.blue },
	{ type: 'ghost', color: colors.green, id: 'ghost-4', row: 14, column: 2, imageUrl: ghostsImages.green },
	{ type: 'ghost', color: colors.pink, id: 'ghost-5', row: 11, column: 4, imageUrl: ghostsImages.pink },
	{ type: 'ghost', color: colors.blue, id: 'ghost-6', row: 10, column: 5, imageUrl: ghostsImages.blue }
];

export const layers: GameLayers = $state({
	ghosts: [],
	previousPlasma: [],
	escapedGhosts: [],
	catchGhosts: [],
	equipment: []
});

export const matrix: Matrix = $state(
	Array.from(Array(rowsCount).keys()).map(() => Array.from(Array(colsCount).keys()).map(() => null))
);