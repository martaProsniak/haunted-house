import type { Color, MatrixItem, Ghost, Plasma } from './types';
import {
	initialRow,
	firstCol,
	lastCol,
	lastRow,
	layers,
	score,
	lives,
	totalGhosts
} from './gameState.svelte.js';
import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import {colors, plasmaImages} from "./constants";
import {increaseEquipmentThisLevel} from "./equipment.helpers.svelte";

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

const handleBombHorizontal = (row: number, matchingItems: MatrixItem[]) => {
	layers.matrix[row].forEach((item, index) => {
		if (item) {
			item.isBombed = true;
			matchingItems.push(item)
		}
		if (!item) {
			matchingItems.push(createBombItem(row, index));
		}
	})
	return matchingItems;
}

const removeItem = (row: number, col: number, matchingItems: MatrixItem[]) => {
	if (row > lastRow) {
		return matchingItems;
	}
	const item = layers.matrix[row][col];
	if (item) {
		item.isBombed = true;
		matchingItems.push(item)
	}
	if (!item) {
		matchingItems.push(createBombItem(row, col));
	}
	return removeItem(row + 1, col, matchingItems);
}

const createBombItem = (row: number, col: number): Plasma => {
	return {
		id: uuidv4(),
		row: row,
		column: col,
		imageUrl: plasmaImages.bomb,
		color: 'bomb',
		type: 'plasma',
		isBombed: true,
	}
}

const handleBombVertical = (col: number, matchingItems: MatrixItem[]) => {
	return removeItem(initialRow, col, matchingItems);
}

export const matchColorVertical = (row: number, column: number) => {
	const itemInMatrix = layers.matrix[row][column];
	if (!itemInMatrix) {
		return [];
	}
	const { color, type } = itemInMatrix; // base item to match
	if (color === 'rainbow') {
		return handleRainbowVertical(row, column, itemInMatrix);
	}
	if (color === 'bomb') {
		return handleBombVertical(column, []);
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
	if (color === 'bomb') {
		return handleBombHorizontal(row, []);
	}
	let hasGhost = type === "ghost";
	const matchingItems: MatrixItem[] = [itemInMatrix];

	const resultLeft = findNextMatchingItemLeft(row, column - 1, color, matchingItems, hasGhost);
	const resultAll = findNextMatchingItemRight(row, column + 1, color, resultLeft.matchingItems, resultLeft.hasGhost);

	return resultAll.matchingItems;
};


export const clearItems = (matchingItems: MatrixItem[]) => {

	if (matchingItems.length < 4 && !matchingItems.some(item => item.color === 'bomb')) {
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
			if (item.imageUrl.includes('bomb')) {
				return;
			}
			points += 20;
		}
	});

	const removedPlasma: MatrixItem[] = Object.values(plasmaToRemove);
	const removedGhosts: MatrixItem[] = Object.values(ghostsToRemove);
	const id = uuidv4();
	layers.removedItems[id] = [...removedGhosts.concat(...removedPlasma)];
	layers.previousPlasma = layers.previousPlasma.filter((plasma) => !plasmaToRemove[plasma.id]);
	layers.ghosts = layers.ghosts.filter((ghost) => !ghostsToRemove[ghost.id]);
	countCatchGhosts(ghostsToRemove);
	score.set(get(score) + points);
};

export const checkResult = (noMoreMoves = false) => {
	if (get(lives) === 0) {
		return 'failure';
	}

	if (layers.ghosts.length && !noMoreMoves) {
		return;
	}

	if (layers.ghosts.length && noMoreMoves) {
		return 'failure';
	}

	const catchCount = Object.keys(layers.catchGhosts).length;

	if (!catchCount) return 'failure';

	increaseEquipmentThisLevel();
	return 'success';
};
