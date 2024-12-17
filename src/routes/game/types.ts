export type Rotation = 0 | 90 | 180 | 270;

export type PillPosition = 'horizontal' | 'vertical' | 'verticalFlipped';

export type SpecialColor = 'rainbow';
export type BaseColor = 'pink' | 'green' | 'blue'
export type Color = BaseColor | SpecialColor;


export interface Bullet {
	current: Color,
	derived: Color,
}

interface Neighbors {
	top: MatrixItem | null;
	bottom: MatrixItem | null;
	left: MatrixItem | null;
	right: MatrixItem | null;
}

export interface MatrixItem {
	type: 'plasma' | 'ghost';
	color: Color;
	id: string;
	row: number;
	column: number;
	imageUrl: string;
	toBeRemoved?: boolean;
}


export interface Ghost extends MatrixItem {
	type: 'ghost';
	color: BaseColor;
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

export type GhostSummary = Record<string, Ghost>

export type RemovedItems = Record<string, Array<MatrixItem | null>>

export interface EquipmentItem {
	count: number;
	image: string,
	type: SpecialColor,
	color: SpecialColor,
	key: string,
	handler: () => void,
}

export interface Equipment {
	rainbow: EquipmentItem
}

export interface GameLayers {
	matrix: Matrix;
	ghosts: Ghost[];
	previousPlasma: Plasma[];
    escapedGhosts: GhostSummary;
    catchGhosts: GhostSummary;
	removedItems: RemovedItems,
}