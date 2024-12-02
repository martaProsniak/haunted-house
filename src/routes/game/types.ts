export type Rotation = 0 | 90 | 180 | 270;

export type PillPosition = 'horizontal' | 'vertical' | 'verticalFlipped';

export type Color = 'pink' | 'green' | 'blue';

export interface MatrixItem {
	type: 'plasma' | 'ghost';
	color: Color;
	id: string;
	row: number;
	column: number;
	imageUrl: string;
}

interface Neighbors {
	top: MatrixItem | null;
	bottom: MatrixItem | null;
	left: MatrixItem | null;
	right: MatrixItem | null;
}

export interface Ghost extends MatrixItem {
	type: 'ghost';
	isGlued: boolean;
	hasMoved: boolean;
	neighbors: Neighbors,
	hasPillAbove: boolean;
}

export interface Plasma extends MatrixItem {
	type: 'plasma';
}

export type Matrix = Array<Array<MatrixItem | null>>;

export type GameStatus = 'not-started' | 'started' | 'playing' | 'success' | 'failure';

export type GhostSummary = Record<string, number>

export interface GameLayers {
	matrix: Matrix;
	ghosts: Ghost[];
	previousPlasma: Plasma[];
    escapedGhosts: GhostSummary;
    catchGhosts: GhostSummary;
    equipment: Plasma[];
}