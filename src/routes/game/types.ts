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

export interface Ghost extends MatrixItem {
	type: 'ghost';
}

export interface Plasma extends MatrixItem {
	type: 'plasma';
}

export type Matrix = Array<Array<MatrixItem | null>>;

export type GameStatus = 'not-started' | 'started' | 'playing' | 'success' | 'failure';

export interface GameLayers {
	matrix: Matrix;
	ghosts: Ghost[];
	previousPlasma: Plasma[];
    escapedGhosts: Ghost[];
    catchGhosts: Ghost[];
    equipment: Plasma[];
}