import type { Color, MatrixItem } from './types';
import { lastCol, lastRow, layers, score } from './game.state.svelte';
import {get} from "svelte/store";

export const countCatchGhosts = (ghosts: Record<string, MatrixItem>) => {
	Object.values(ghosts).forEach((ghost) => {
		layers.catchGhosts[ghost.color]++;
	});
};

export const findNextMatchingItemDown = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	hasGhost = false
): MatrixItem[] => {
	if (row > lastRow) {
		return matchingItems;
	}
	const item = layers.matrix[row]?.[col];
	if (item?.color !== color) {
		return matchingItems;
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return matchingItems;
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemDown(row + 1, col, color, matchingItems, hasGhost);
};

export const findNextMatchingItemUp = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	hasGhost = false
): MatrixItem[] => {
	if (row === 1) {
		return matchingItems;
	}
	const item = layers.matrix[row]?.[col];
	if (item?.color !== color) {
		return matchingItems;
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return matchingItems;
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemUp(row - 1, col, color, matchingItems, hasGhost);
};

export const findNextMatchingItemLeft = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	hasGhost = false
): MatrixItem[] => {
	if (col < 0) {
		return matchingItems;
	}
	const item = layers.matrix[row]?.[col];
	if (item?.color !== color) {
		return matchingItems;
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return matchingItems;
		}
		hasGhost = true;
	}
	matchingItems.push(item);
	return findNextMatchingItemLeft(row, col - 1, color, matchingItems, hasGhost);
};

export const findNextMatchingItemRight = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	hasGhost = false
): MatrixItem[] => {
	if (col === lastCol) {
		return matchingItems;
	}
	const item = layers.matrix[row]?.[col];
	if (item?.color !== color) {
		return matchingItems;
	}
	if (item.type === 'ghost') {
		if (hasGhost) {
			return matchingItems;
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
	const { color } = itemInMatrix;
	const matchingItems: MatrixItem[] = [itemInMatrix];
	findNextMatchingItemDown(row + 1, column, color, matchingItems);
	findNextMatchingItemUp(row - 1, column, color, matchingItems);

	return matchingItems;
};

export const matchColorHorizontal = (row: number, column: number) => {
	const itemInMatrix = layers.matrix[row][column];
	if (!itemInMatrix) {
		return [];
	}
	const { color } = itemInMatrix;
	const matchingItems: MatrixItem[] = [itemInMatrix];
	findNextMatchingItemLeft(row, column - 1, color, matchingItems);
	findNextMatchingItemRight(row, column + 1, color, matchingItems);

	return matchingItems;
};

export const clearItems = (matchingItems: MatrixItem[]) => {
	if (matchingItems.length < 4) {
		return 0;
	}

	const plasmaToRemove: Record<string, MatrixItem> = {};
	const ghostsToRemove: Record<string, MatrixItem> = {};
    let points = 0;

	matchingItems.forEach((item) => {
		if (item.type === 'ghost') {
			ghostsToRemove[item.id] = item;
            points += 100;
		}
		if (item.type === 'plasma') {
			plasmaToRemove[item.id] = item;
            points += 20;
		}
	});

	layers.previousPlasma = layers.previousPlasma.filter((plasma) => !plasmaToRemove[plasma.id]);
	layers.ghosts = layers.ghosts.filter((ghost) => !ghostsToRemove[ghost.id]);
	countCatchGhosts(ghostsToRemove);
    score.set(get(score) + points)
};

export const checkResult = () => {
    if (layers.ghosts.length) {
        return;
    }
    const anyGhostCatch = Object.values(layers.catchGhosts).some((value) => value > 0);
    return anyGhostCatch ? 'success' : 'failure';
}