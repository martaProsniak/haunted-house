import { type Writable, writable, derived, type Readable } from 'svelte/store';
import { colors, getRandomColor } from './utils';
import type { Ghost, Matrix, Plasma, Rotation } from './types';

import blueGhost from '$lib/assets/ghost-blue.png';
import pinkGhost from '$lib/assets/ghost-pink.png';
import greenGhost from '$lib/assets/ghost-green.png';

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

export const matrix: Matrix = $state(
	Array.from(Array(rowsCount).keys()).map(() => Array.from(Array(colsCount).keys()).map(() => null))
);

export const currentRow: Writable<number> = writable(initialRow);
export const currentCol: Writable<number> = writable(initialCol);
export const rotation: Writable<Rotation> = writable(0);

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

const initialGhosts: Ghost[] = [
	{ type: 'ghost', color: colors.green, id: 'ghost-1', row: 13, column: 10, imageUrl: greenGhost },
	{ type: 'ghost', color: colors.pink, id: 'ghost-2', row: 7, column: 6, imageUrl: pinkGhost },
	{ type: 'ghost', color: colors.blue, id: 'ghost-3', row: 9, column: 12, imageUrl: blueGhost }
];

interface GameLayers {
	ghosts: Ghost[];
	previousPlasma: Plasma[];
}

export const layers: GameLayers = $state({
	ghosts: initialGhosts,
	previousPlasma: []
});
