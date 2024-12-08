import type {Color, MatrixItem, Ghost, Plasma, Matrix} from './types';
import { lastCol, lastRow, layers, score, totalGhosts } from './gameState.svelte.js';
import {get} from "svelte/store";

export const countCatchGhosts = (ghosts: Record<string, Ghost>) => {
	Object.values(ghosts).forEach((ghost) => {
		if (layers.catchGhosts[ghost.id]) {
			console.log('Already present')
			return;
		}
		layers.catchGhosts[ghost.id] = ghost;
	});
};

export const findNextMatchingItemDown = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	matrix: Matrix,
	hasGhost = false
): MatrixItem[] => {
	if (row > lastRow) {
		return matchingItems;
	}
	const item = matrix[row]?.[col];
	if (item?.color !== color || item.id.includes('plasma')) {
		return matchingItems;
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return matchingItems;
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemDown(row + 1, col, color, matchingItems, matrix, hasGhost);
};

export const findNextMatchingItemUp = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	matrix: Matrix,
	hasGhost = false
): MatrixItem[] => {
	if (row === 1) {
		return matchingItems;
	}
	const item = matrix[row]?.[col];
	if (item?.color !== color || item.id.includes('plasma')) {
		return matchingItems;
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return matchingItems;
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemUp(row - 1, col, color, matchingItems, matrix, hasGhost);
};

export const findNextMatchingItemLeft = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	matrix: Matrix,
	hasGhost = false
): MatrixItem[] => {
	if (col < 0) {
		return matchingItems;
	}
	const item = matrix[row]?.[col];
	if (item?.color !== color || item.id.includes('plasma')) {
		return matchingItems;
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return matchingItems;
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemLeft(row, col - 1, color, matchingItems, matrix, hasGhost);
};

export const findNextMatchingItemRight = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	matrix: Matrix,
	hasGhost = false
): MatrixItem[] => {
	if (col === lastCol) {
		return matchingItems;
	}
	const item = matrix[row]?.[col];
	if (item?.color !== color || item.id.includes('plasma')) {
		return matchingItems;
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return matchingItems;
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemRight(row, col + 1, color, matchingItems, matrix, hasGhost);
};

export const matchColorVertical = (row: number, column: number, matrix: Matrix) => {
	const itemInMatrix = matrix[row][column];
	if (!itemInMatrix) {
		return [];
	}
	const { color } = itemInMatrix;
	const matchingItems: MatrixItem[] = [itemInMatrix];
	findNextMatchingItemDown(row + 1, column, color, matchingItems, matrix);
	findNextMatchingItemUp(row - 1, column, color, matchingItems, matrix);

	return matchingItems;
};

export const matchColorHorizontal = (row: number, column: number, matrix: Matrix) => {
	const itemInMatrix = matrix[row][column];
	if (!itemInMatrix) {
		return [];
	}
	const { color } = itemInMatrix;
	const matchingItems: MatrixItem[] = [itemInMatrix];
	findNextMatchingItemLeft(row, column - 1, color, matchingItems, matrix);
	findNextMatchingItemRight(row, column + 1, color, matchingItems, matrix);

	return matchingItems;
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

	layers.previousPlasma = layers.previousPlasma.filter((plasma) => !plasmaToRemove[plasma.id]);
	layers.ghosts = layers.ghosts.filter((ghost) => !ghostsToRemove[ghost.id]);
	countCatchGhosts(ghostsToRemove);
    score.set(get(score) + points)
};

export const checkResult = (noMoreMoves = false) => {
	if (layers.ghosts.length && !noMoreMoves) {
        return;
    }

    return Object.keys(layers.catchGhosts).length >= get(totalGhosts) / 2 ? 'success' : 'failure';
}