import type {Color, Ghost, GhostSummary} from './types';
import { v4 as uuidv4 } from 'uuid';
import { colors, ghostsImages } from './constants';

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
	rowsCount: 14,
	colsCount: 8,
	minRow: 7,
	maxRow: 13
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
	const baseGhosts = 3;
	const incrementPerLevel = 1;
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

export const groupGhostsPerColor = (ghosts: GhostSummary) => {
	return Object.values(ghosts).reduce((acc, ghost) => {
		acc[ghost.color]++;
		return acc;
	}, {pink: 0, blue: 0, green: 0})
}