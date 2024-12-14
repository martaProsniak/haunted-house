import type { Color, MatrixItem, Ghost, Plasma } from './types';
import {
	initialRow,
	initialCol,
	lastCol,
	lastRow,
	layers,
	score,
	totalGhosts
} from './gameState.svelte.js';
import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export const countCatchGhosts = (ghosts: Record<string, Ghost>) => {
	Object.values(ghosts).forEach((ghost) => {
		if (layers.catchGhosts[ghost.id]) {
			console.log('Already present');
			return;
		}
		layers.catchGhosts[ghost.id] = ghost;
	});
};

type MatcherFn = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	hasGhost: boolean
) => {
	matchingItems: MatrixItem[];
	hasGhost: boolean;
};

export const findNextMatchingItemDown: MatcherFn = (
	row,
	col,
	color,
	matchingItems,
	hasGhost = false
) => {
	if (row > lastRow) {
		return {
			matchingItems,
			hasGhost
		};
	}
	const item = layers.matrix[row]?.[col];
	if (item?.color !== color) {
		return {
			matchingItems,
			hasGhost
		};
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return {
				matchingItems,
				hasGhost
			};
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemDown(row + 1, col, color, matchingItems, hasGhost);
};

export const findNextMatchingItemUp: MatcherFn = (
	row,
	col,
	color,
	matchingItems,
	hasGhost = false
) => {
	if (row < initialRow) {
		return {
			matchingItems,
			hasGhost
		};
	}
	const item = layers.matrix[row]?.[col];
	if (item?.color !== color) {
		return {
			matchingItems,
			hasGhost
		};
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return {
				matchingItems,
				hasGhost
			};
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemUp(row - 1, col, color, matchingItems, hasGhost);
};

export const findNextMatchingItemLeft: MatcherFn = (
	row,
	col,
	color,
	matchingItems,
	hasGhost = false
) => {
	if (col < initialCol) {
		return {
			matchingItems, hasGhost
		};
	}
	const item = layers.matrix[row]?.[col];
	if (item?.color !== color) {
		return {
			matchingItems, hasGhost
		};
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return {
			matchingItems, hasGhost
		};
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemLeft(row, col - 1, color, matchingItems, hasGhost);
};

export const findNextMatchingItemRight: MatcherFn = (
	row,
	col,
	color,
	matchingItems,
	hasGhost = false
) => {
	if (col > lastCol) {
		return {
			matchingItems, hasGhost
		};
	}
	const item = layers.matrix[row]?.[col];
	if (item?.color !== color) {
		return {
			matchingItems, hasGhost
		};
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return {
			matchingItems, hasGhost
		};
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemRight(row, col + 1, color, matchingItems, hasGhost);
};

export const matchColorVertical = (row: number, column: number) => {
	const itemInMatrix = layers.matrix[row][column];
	if (!itemInMatrix) {
		return [];
	}
	const { color, type } = itemInMatrix;
	let hasGhost = type === 'ghost';
	const matchingItems: MatrixItem[] = [itemInMatrix];
	const resultDown = findNextMatchingItemDown(row + 1, column, color, matchingItems, hasGhost);
	const resultAll = findNextMatchingItemUp(row - 1, column, color, resultDown.matchingItems, resultDown.hasGhost);

	return resultAll.matchingItems;
};

export const matchColorHorizontal = (row: number, column: number) => {
	const itemInMatrix = layers.matrix[row][column];
	if (!itemInMatrix) {
		return [];
	}
	const { color, type } = itemInMatrix;
	let hasGhost = type === 'ghost';
	const matchingItems: MatrixItem[] = [itemInMatrix];
	const resultLeft = findNextMatchingItemLeft(row, column - 1, color, matchingItems, hasGhost);
	const resultAll = findNextMatchingItemRight(row, column + 1, color, resultLeft.matchingItems, resultLeft.hasGhost);

	return resultAll.matchingItems;
};

export const clearItems = (matchingItems: MatrixItem[]) => {
	if (matchingItems.length < 4) {
		return 0;
	}

	const plasmaToRemove: Record<string, Plasma> = {};
	const ghostsToRemove: Record<string, Ghost> = {};
	let points = 0;

	matchingItems.forEach((item) => {
		if (item.type === 'ghost') {
			if (ghostsToRemove[item.id]) {
				return;
			}
			ghostsToRemove[item.id] = item as Ghost;
			points += 100;
		}
		if (item.type === 'plasma') {
			if (plasmaToRemove[item.id]) {
				return;
			}
			plasmaToRemove[item.id] = item as Plasma;
			points += 20;
		}
	});

	const removedPlasma: MatrixItem[] = layers.previousPlasma.filter(
		(plasma) => plasmaToRemove[plasma.id]
	);
	const removedGhosts: MatrixItem[] = layers.ghosts.filter((ghost) => ghostsToRemove[ghost.id]);
	const id = uuidv4();
	layers.removedItems[id] = removedGhosts.concat(...removedPlasma);
	layers.previousPlasma = layers.previousPlasma.filter((plasma) => !plasmaToRemove[plasma.id]);
	layers.ghosts = layers.ghosts.filter((ghost) => !ghostsToRemove[ghost.id]);
	countCatchGhosts(ghostsToRemove);
	score.set(get(score) + points);
};

export const checkResult = (noMoreMoves = false) => {
	if (layers.ghosts.length && !noMoreMoves) {
		return;
	}

	return Object.keys(layers.catchGhosts).length >= get(totalGhosts) / 2 ? 'success' : 'failure';
};
