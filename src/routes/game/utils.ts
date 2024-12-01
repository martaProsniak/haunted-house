import type { Color, Ghost } from './types';
import { v4 as uuidv4 } from "uuid";

import greenPlasma from '$lib/assets/plasma-green.png';
import pinkPlasma from '$lib/assets/plasma-pink.png';
import bluePlasma from '$lib/assets/plasma-blue.png';

import blueGhost from '$lib/assets/ghost-blue.gif';
import pinkGhost from '$lib/assets/ghost-pink.gif';
import greenGhost from '$lib/assets/ghost-green.gif';

export const colors: Record<string, Color> = {
	pink: 'pink',
	blue: 'blue',
	green: 'green'
};

export const plasmaImages: Record<Color, string>= {
	pink: pinkPlasma,
	blue: bluePlasma,
	green: greenPlasma,
} as const;

export const ghostsImages: Record<Color, string>= {
	pink: pinkGhost,
	blue: blueGhost,
	green: greenGhost,
} as const;

export const getRandomColor = () => {
	return Object.values(colors)[Math.floor(Math.random() * Object.values(colors).length)];
}

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
}

const CONFIG = {
	rowsCount: 16,
	colsCount: 16,
	minRow: 4,
	maxRow: 15
};

// Generowanie wagi dla rzędów
function generateWeightedRows(): number[] {
	const { minRow, maxRow } = CONFIG;
	const weights = Array.from({ length: maxRow - minRow + 1 }, (_, i) => minRow + i).map(row => ({
		row,
		weight: row - minRow + 1
	}));
	return weights.flatMap(({ row, weight }) => Array(weight).fill(row));
}

// Losowanie rzędu z wagami
function weightedRowRandom(): number {
	const weightedRows = generateWeightedRows();
	return weightedRows[Math.floor(Math.random() * weightedRows.length)];
}

// Losowanie unikalnej pozycji `(row, column)`
function getUniquePosition(positions: Set<string>, rowsRange: number[], colsCount: number): { row: number; column: number } {
	let row: number, column: number;

	do {
		row = weightedRowRandom(); // Losuj rząd
		column = Math.floor(Math.random() * colsCount); // Losuj kolumnę
	} while (positions.has(`${row},${column}`));

	positions.add(`${row},${column}`);
	return { row, column };
}

// Obliczanie maksymalnej liczby duszków
function calculateMaxGhosts(level: number): number {
	const baseGhosts = 6;
	const incrementPerLevel = 4;
	const maxGhostsLimit = Math.floor(0.75 * CONFIG.rowsCount * CONFIG.colsCount);

	return Math.min(baseGhosts + (level - 1) * incrementPerLevel, maxGhostsLimit);
}

// Generowanie duszków
export function generateGhosts(level: number): Ghost[] {
	const maxGhosts = calculateMaxGhosts(level);
	const colors: Color[] = ['pink', 'green', 'blue'];
	const ghostsPerColor = Math.floor(maxGhosts / colors.length);
	const positions = new Set<string>();
	const rowsRange = Array.from({ length: CONFIG.maxRow - CONFIG.minRow + 1 }, (_, i) => CONFIG.minRow + i);

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

	return colors.flatMap(color =>
		Array(colorCounts[color]).fill(null).map(() => {
			const { row, column } = getUniquePosition(positions, rowsRange, CONFIG.colsCount);

			return {
				type: 'ghost',
				color,
				id: uuidv4(),
				row,
				column,
				imageUrl: ghostsImages[color]
			};
		})
	);
}
