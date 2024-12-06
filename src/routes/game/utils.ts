import type { Color, Ghost, MatrixItem } from './types';
import { v4 as uuidv4 } from 'uuid';

import greenPlasma from '$lib/assets/plasma-green.png';
import pinkPlasma from '$lib/assets/plasma-pink.png';
import bluePlasma from '$lib/assets/plasma-blue.png';

import blueGhost from '$lib/assets/ghost-blue.png';
import pinkGhost from '$lib/assets/ghost-pink.png';
import greenGhost from '$lib/assets/ghost-green.png';

import blueGhostGif from '$lib/assets/ghost-blue.gif';
import pinkGhostGif from '$lib/assets/ghost-pink.gif';
import greenGhostGif from '$lib/assets/ghost-green.gif';

import blueGhostGlued from '$lib/assets/ghost-blue-glued.png';
import pinkGhostGlued from '$lib/assets/ghost-pink-glued.png';
import greenGhostGlued from '$lib/assets/ghost-green-glued.png';
import { lastCol, lastRow, layers } from './game.state.svelte';

export const colors: Record<string, Color> = {
	pink: 'pink',
	blue: 'blue',
	green: 'green'
};

export const plasmaImages: Record<Color, string> = {
	pink: pinkPlasma,
	blue: bluePlasma,
	green: greenPlasma
} as const;

export const ghostsImages: Record<Color, string> = {
	pink: pinkGhost,
	blue: blueGhost,
	green: greenGhost
} as const;

export const ghostsImagesGlued: Record<Color, string> = {
	pink: pinkGhostGlued,
	blue: blueGhostGlued,
	green: greenGhostGlued
} as const;

export const ghostsGifs: Record<Color, string> = {
	pink: pinkGhostGif,
	blue: blueGhostGif,
	green: greenGhostGif
} as const;

export const getRandomColor = () => {
	return Object.values(colors)[Math.floor(Math.random() * Object.values(colors).length)];
};

export const getRandomPill: () => { current: Color; derived: Color } = () => {
	const singleColorChance = 0.25;

	let current = getRandomColor();
	let derived = current;

	if (Math.random() >= singleColorChance) {
		do {
			derived = getRandomColor();
		} while (current === derived);
	}

	return { current, derived };
};

const CONFIG = {
	rowsCount: 16,
	colsCount: 16,
	minRow: 6,
	maxRow: 15
};

function generateWeightedRows(): number[] {
	const { minRow, maxRow } = CONFIG;
	const weights = Array.from({ length: maxRow - minRow + 1 }, (_, i) => minRow + i).map((row) => ({
		row,
		weight: row - minRow + 1
	}));
	return weights.flatMap(({ row, weight }) => Array(weight).fill(row));
}

function weightedRowRandom(): number {
	const weightedRows = generateWeightedRows();
	return weightedRows[Math.floor(Math.random() * weightedRows.length)];
}

function getUniquePosition(
	positions: Set<string>,
	rowsRange: number[],
	colsCount: number
): { row: number; column: number } {
	let row: number, column: number;

	do {
		row = weightedRowRandom();
		column = Math.floor(Math.random() * colsCount);
	} while (positions.has(`${row},${column}`));

	positions.add(`${row},${column}`);
	return { row, column };
}

function calculateMaxGhosts(level: number): number {
	const baseGhosts = 6;
	const incrementPerLevel = 4;
	const maxGhostsLimit = Math.floor(0.75 * CONFIG.rowsCount * CONFIG.colsCount);

	return Math.min(baseGhosts + (level - 1) * incrementPerLevel, maxGhostsLimit);
}

function shuffleArray(array: Ghost[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export function generateGhosts(level: number): Ghost[] {
	const maxGhosts = calculateMaxGhosts(level);
	const colors: Color[] = ['pink', 'green', 'blue'];
	const ghostsPerColor = Math.floor(maxGhosts / colors.length);
	const positions = new Set<string>();
	const rowsRange = Array.from(
		{ length: CONFIG.maxRow - CONFIG.minRow + 1 },
		(_, i) => CONFIG.minRow + i
	);

	const colorCounts: Record<Color, number> = {
		pink: ghostsPerColor,
		green: ghostsPerColor,
		blue: ghostsPerColor
	};

	let remainingGhosts = maxGhosts - ghostsPerColor * colors.length;
	while (remainingGhosts > 0) {
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		colorCounts[randomColor]++;
		remainingGhosts--;
	}

	const ghosts: Ghost[] = colors.flatMap((color) =>
		Array(colorCounts[color])
			.fill(null)
			.map(() => {
				const { row, column } = getUniquePosition(positions, rowsRange, CONFIG.colsCount);

				return {
					type: 'ghost',
					color,
					id: uuidv4(),
					row,
					column,
					imageUrl: ghostsImages[color],
					isGlued: false,
					hasMoved: false,
					neighbors: {
						top: null,
						bottom: null,
						left: null,
						right: null
					},
					hasPillAbove: false
				};
			})
	);

	return shuffleArray(ghosts);
}
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
): MatrixItem[]  => {
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
): MatrixItem[]  => {
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
): MatrixItem[]  => {
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