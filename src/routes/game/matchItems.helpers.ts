import type { Color, MatrixItem, Ghost, Plasma } from './types';
import {
	initialRow,
	firstCol,
	lastCol,
	lastRow,
	layers,
	score,
	totalGhosts,
	equipment, equipmentThisLevel
} from './gameState.svelte.js';
import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import {colors} from "./constants";

export const countCatchGhosts = (ghosts: Record<string, Ghost>) => {
	Object.values(ghosts).forEach((ghost) => {
		if (layers.catchGhosts[ghost.id]) {
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

const findNextMatchingItem = (
	row: number,
	col: number,
	color: Color,
	matchingItems: MatrixItem[],
	hasGhost: boolean,
	getNextPosition: (row: number, col: number) => { row: number; col: number },
	boundaryCheck: (row: number, col: number) => boolean
): { matchingItems: MatrixItem[]; hasGhost: boolean } => {
	if (boundaryCheck(row, col)) {
		return { matchingItems, hasGhost };
	}

	const item = layers.matrix[row]?.[col];

	if (!item || (item.color !== color && item.color !== "rainbow")) {
		return { matchingItems, hasGhost };
	}

	if (item.type === "ghost") {
		if (hasGhost) {
			return { matchingItems, hasGhost };
		}
		hasGhost = true;
	}

	matchingItems.push(item);

	const nextPosition = getNextPosition(row, col);
	return findNextMatchingItem(
		nextPosition.row,
		nextPosition.col,
		color,
		matchingItems,
		hasGhost,
		getNextPosition,
		boundaryCheck
	);
};

const nextDown = (row: number, col: number) => ({ row: row + 1, col });
const nextUp = (row: number, col: number) => ({ row: row - 1, col });
const nextLeft = (row: number, col: number) => ({ row, col: col - 1 });
const nextRight = (row: number, col: number) => ({ row, col: col + 1 });

const isOutOfBoundsDown = (row: number) => row > lastRow;
const isOutOfBoundsUp = (row: number) => row < initialRow;
const isOutOfBoundsLeft = (col: number) => col < firstCol;
const isOutOfBoundsRight = (col: number) => col > lastCol;

export const findNextMatchingItemDown: MatcherFn = (row, col, color, matchingItems, hasGhost = false) =>
	findNextMatchingItem(row, col, color, matchingItems, hasGhost, nextDown, (r, _) => isOutOfBoundsDown(r));

export const findNextMatchingItemUp: MatcherFn = (row, col, color, matchingItems, hasGhost = false) =>
	findNextMatchingItem(row, col, color, matchingItems, hasGhost, nextUp, (r, _) => isOutOfBoundsUp(r));

export const findNextMatchingItemLeft: MatcherFn = (row, col, color, matchingItems, hasGhost = false) => {
	return findNextMatchingItem(row, col, color, matchingItems, hasGhost, nextLeft, (_, c) => isOutOfBoundsLeft(c));
}

export const findNextMatchingItemRight: MatcherFn = (row, col, color, matchingItems, hasGhost = false) =>
	findNextMatchingItem(row, col, color, matchingItems, hasGhost, nextRight, (_, c) => isOutOfBoundsRight(c));

const handleRainbowVertical = (row: number, column: number, baseItem: MatrixItem) => {
	const colorsToCheck: Color[] = [colors.pink, colors.blue, colors.green];
	let allMatchingItems: MatrixItem[] = [];
	let hasGhost = baseItem.type === "ghost";

	colorsToCheck.forEach((currentColor) => {
		const matchingItems: MatrixItem[] = [baseItem];

		const resultDown = findNextMatchingItemDown(
			row + 1,
			column,
			currentColor,
			matchingItems,
			hasGhost
		);
		const resultAll = findNextMatchingItemUp(
			row - 1,
			column,
			currentColor,
			resultDown.matchingItems,
			resultDown.hasGhost
		);

		allMatchingItems = [
			...allMatchingItems,
			...resultAll.matchingItems.filter(
				(item) => !allMatchingItems.includes(item)
			),
		];
	});

	return allMatchingItems;
};

const handleRainbowHorizontal = (row: number, column: number, baseItem: MatrixItem) => {
	const colorsToCheck: Color[] = [colors.pink, colors.blue, colors.green];
	let allMatchingItems: MatrixItem[] = [];
	let hasGhost = baseItem.type === "ghost";

	colorsToCheck.forEach((currentColor) => {
		const matchingItems: MatrixItem[] = [baseItem];

		const resultLeft = findNextMatchingItemLeft(
			row,
			column - 1,
			currentColor,
			matchingItems,
			hasGhost
		);
		const resultAll = findNextMatchingItemRight(
			row,
			column + 1,
			currentColor,
			resultLeft.matchingItems,
			resultLeft.hasGhost
		);

		allMatchingItems = [
			...allMatchingItems,
			...resultAll.matchingItems.filter(
				(item) => !allMatchingItems.includes(item)
			),
		];
	});

	return allMatchingItems;
};


export const matchColorVertical = (row: number, column: number) => {
	const itemInMatrix = layers.matrix[row][column];
	if (!itemInMatrix) {
		return [];
	}
	const { color, type } = itemInMatrix; // base item to match
	if (color === 'rainbow') {
		return handleRainbowVertical(row, column, itemInMatrix);
	}
	let hasGhost = type === "ghost";
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
	const { color, type } = itemInMatrix;// base item to match
	if (color === 'rainbow') {
		return handleRainbowHorizontal(row, column, itemInMatrix);
	}
	let hasGhost = type === "ghost";
	const matchingItems: MatrixItem[] = [itemInMatrix];

	const resultLeft = findNextMatchingItemLeft(row, column - 1, color, matchingItems, hasGhost);
	const resultAll = findNextMatchingItemRight(row, column + 1, color, resultLeft.matchingItems, resultLeft.hasGhost);

	return resultAll.matchingItems;
};


export const clearItems = (matchingItems: MatrixItem[]) => {
	if (matchingItems.length < 4) {
		return;
	}

	const plasmaToRemove: Record<string, Plasma> = {};
	const ghostsToRemove: Record<string, Ghost> = {};
	let points = 0;

	matchingItems.forEach((item) => {
		item.toBeRemoved = true
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
	layers.removedItems[id] = [...removedGhosts.concat(...removedPlasma)];
	layers.previousPlasma = layers.previousPlasma.filter((plasma) => !plasmaToRemove[plasma.id]);
	layers.ghosts = layers.ghosts.filter((ghost) => !ghostsToRemove[ghost.id]);
	countCatchGhosts(ghostsToRemove);
	score.set(get(score) + points);
};

export const checkResult = (noMoreMoves = false) => {
	if (layers.ghosts.length && !noMoreMoves) {
		return;
	}

	const result = Object.keys(layers.catchGhosts).length >= get(totalGhosts) * 0.75 ? 'success' : 'failure';
	if (result === 'success') {
		if (Object.keys(layers.catchGhosts).length === get(totalGhosts)) {
			equipment.rainbow.count++;
			equipmentThisLevel.rainbow.count++;
		}
	}
	return result;
};
