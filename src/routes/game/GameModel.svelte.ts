import type {Color, GameLayers, GameStatus, Ghost, MatrixItem, Plasma, Rotation} from './types';
import {generateGhosts, getRandomColor, getRandomPill} from './utils';
import { v4 as uuidv4 } from 'uuid';
import { plasmaImages } from './constants';
import {get} from "svelte/store";

export interface LastPlasma {
	curr: Plasma;
	der: Plasma;
}

class Game {
	// Constants
	private rowsCount = 16;
	private colsCount = 16;
	private initialMatrix = Array.from(Array(this.rowsCount).keys()).map(() =>
		Array.from(Array(this.colsCount).keys()).map(() => null)
	);
	initialRow = 0;
	initialCol = 7;
	lastRow = this.rowsCount - 1;
	lastCol = this.colsCount - 1;
	offset = 44;
	gap = 4;
	initialTop = this.gap;
	initialLeft = this.gap + (this.initialCol * this.offset);

	// Game state
	gameStatus: GameStatus = $state('not-started');
	level = $state(0);
	isPaused = $state(false);
	score = $state(0);
	totalScore = $state(0);
	totalGhosts = $state(0);

	currentRow = $state(this.initialRow);
	currentCol = $state(this.initialCol);
	rotation: Rotation = $state(0);

	derivedRow = $derived.by(() => {
		if (this.rotation === 90) {
			return this.currentRow + 1;
		}
		if (this.rotation === 270) {
			return this.currentRow - 1;
		}
		return this.currentRow;
	});

	derivedCol = $derived.by(() => {
		if (this.rotation === 0) {
			return this.currentCol + 1;
		}

		if (this.rotation === 180) {
			return this.currentCol - 1;
		}

		return this.currentCol;
	});

	layers: GameLayers = $state({
		matrix: this.initialMatrix,
		ghosts: [],
		previousPlasma: [],
		escapedGhosts: {},
		catchGhosts: {},
		equipment: [],
		removedItems: {}
	});

	// Current plasma
	flyingPlasmaColors = $state({
		current: getRandomColor(),
		derived: getRandomColor()
	});
	nextPlasmaColors = $state({
		current: getRandomColor(),
		derived: getRandomColor()
	});
	left = $state(this.initialLeft);
	topCorrection = $state(0);
	top = $derived(this.initialTop + (this.offset * this.currentRow) - this.topCorrection);

	// Helper
	lastPlasma: LastPlasma | null = $state(null);

	prepareGhostsLayer = ()=> {
		this.layers.ghosts = generateGhosts(this.level);
	}

	preparePlasmaLayer = () => {
		this.layers.previousPlasma = [];
	}

	prepareLevel = () => {
		console.log('preparing level')
		this.prepareGhostsLayer();
		this.preparePlasmaLayer();
		this.rotation = 0;
		this.score = 0;
		this.currentRow = this.initialRow;
		this.currentCol = this.initialCol;
		this.totalGhosts = this.layers.ghosts.length;
		this.gameStatus = 'playing';
		this.isPaused = false;
		this.layers.matrix = this.initialMatrix;
		this.layers.catchGhosts = {};
		this.layers.escapedGhosts = {};
	}

	startGame = () => {
		console.log('Starting game')
		console.log(this)
		this.gameStatus = 'started';
		this.isPaused = false;
		this.score = 0;
		this.totalScore = 0;
		this.level = 1;
	}

	togglePause =  () => {
		if (this.gameStatus === 'not-started') {
			return;
		}

		this.isPaused = !this.isPaused;
	}

	restartLevel =  () => {
		this.gameStatus = 'started';
		this.isPaused = false;
		this.score = 0;
	}

	checkResult = (noMoves = false) => {
		if (this.layers.ghosts.length && !noMoves) {
			return;
		}

		return Object.keys(this.layers.catchGhosts).length >= this.totalGhosts / 2 ? 'success' : 'failure';
	}

	checkEndLevel = (noMoves = false) => {
		const result = this.checkResult(noMoves);
		if (result) {
			this.gameStatus = result;
		}
	}

	createLastPlasma = () => {
		const currentPlasma: Plasma = {
			type: 'plasma',
			id: uuidv4(),
			color: this.flyingPlasmaColors.current,
			row: this.currentRow,
			column: this.currentCol,
			imageUrl: plasmaImages[this.flyingPlasmaColors.current]
		};
		const derivedPlasma: Plasma = {
			type: 'plasma',
			id: uuidv4(),
			color: this.flyingPlasmaColors.derived,
			row: this.derivedRow,
			column: this.derivedCol,
			imageUrl: plasmaImages[this.flyingPlasmaColors.derived]
		};

		return { curr: currentPlasma, der: derivedPlasma };
	}

	updatePreviousPlasma = ()=>  {
		this.lastPlasma = this.createLastPlasma();

		this.layers.previousPlasma.push(this.lastPlasma.curr, this.lastPlasma.der);

		this.layers.previousPlasma.forEach((plasma) => {
			this.layers.matrix[plasma.row][plasma.column] = plasma;
		});
	}

	updateMatrix = () => {
		this.layers.matrix.forEach((row, rowIndex) => {
			row.forEach((cell, cellIndex) => {
				const plasma = this.layers.previousPlasma.find(
					(plasma) => plasma.row === rowIndex && plasma.column === cellIndex
				);
				if (plasma) {
					this.layers.matrix[rowIndex][cellIndex] = plasma;
					return;
				}
				const ghost = this.layers.ghosts.find(
					(ghost) => ghost.row === rowIndex && ghost.column === cellIndex
				);
				if (ghost) {
					this.layers.matrix[rowIndex][cellIndex] = ghost;
					return;
				}
				this.layers.matrix[rowIndex][cellIndex] = null;
			});
		});
	}

	loop = () => {
		if (
			this.layers.matrix[this.initialRow + 1][this.initialCol] ||
			this.layers.matrix[this.initialRow + 1][this.initialCol + 1]
		) {
			this.checkEndLevel(true);
		}

		if (!this.isPaused) {
			this.moveCurrentPlasmaDown();
		}
	}

	isPlaying = $derived(this.gameStatus === 'playing');

	isEndLevel = $derived(this.gameStatus === 'success' || this.gameStatus === 'failure')

	countCatchGhosts = (ghosts: Record<string, Ghost>) => {
		Object.values(ghosts).forEach((ghost) => {
			if (this.layers.catchGhosts[ghost.id]) {
				console.log('Already present')
				return;
			}
			this.layers.catchGhosts[ghost.id] = ghost;
		});
	};

	findNextMatchingItemDown = (
		row: number,
		col: number,
		color: Color,
		matchingItems: MatrixItem[],
		hasGhost = false
	): MatrixItem[] => {
		if (row > this.lastRow) {
			return matchingItems;
		}
		const item = this.layers.matrix[row]?.[col];
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
		return this.findNextMatchingItemDown(row + 1, col, color, matchingItems, hasGhost);
	};

	findNextMatchingItemUp = (
		row: number,
		col: number,
		color: Color,
		matchingItems: MatrixItem[],
		hasGhost = false
	): MatrixItem[] => {
		if (row === this.initialRow) {
			return matchingItems;
		}
		const item = this.layers.matrix[row]?.[col];
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
		return this.findNextMatchingItemUp(row - 1, col, color, matchingItems, hasGhost);
	};

	findNextMatchingItemLeft = (
		row: number,
		col: number,
		color: Color,
		matchingItems: MatrixItem[],
		hasGhost = false
	): MatrixItem[] => {
		if (col < 0) {
			return matchingItems;
		}
		const item = this.layers.matrix[row]?.[col];
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
		return this.findNextMatchingItemLeft(row, col - 1, color, matchingItems, hasGhost);
	};

	findNextMatchingItemRight = (
		row: number,
		col: number,
		color: Color,
		matchingItems: MatrixItem[],
		hasGhost = false
	): MatrixItem[] => {
		if (col === this.lastCol) {
			return matchingItems;
		}
		const item = this.layers.matrix[row]?.[col];
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
		return this.findNextMatchingItemRight(row, col + 1, color, matchingItems, hasGhost);
	};

	matchColorVertical = (row: number, column: number) => {
		const itemInMatrix = this.layers.matrix[row][column];
		if (!itemInMatrix) {
			return [];
		}
		const { color } = itemInMatrix;
		const matchingItems: MatrixItem[] = [itemInMatrix];
		this.findNextMatchingItemDown(row + 1, column, color, matchingItems);
		this.findNextMatchingItemUp(row - 1, column, color, matchingItems);

		return matchingItems;
	};

	matchColorHorizontal = (row: number, column: number) => {
		const itemInMatrix = this.layers.matrix[row][column];
		if (!itemInMatrix) {
			return [];
		}
		const { color } = itemInMatrix;
		const matchingItems: MatrixItem[] = [itemInMatrix];
		this.findNextMatchingItemLeft(row, column - 1, color, matchingItems);
		this.findNextMatchingItemRight(row, column + 1, color, matchingItems);

		return matchingItems;
	};

	clearItems = (matchingItems: MatrixItem[]) => {
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

		const removedPlasma: MatrixItem[] = this.layers.previousPlasma.filter((plasma) => plasmaToRemove[plasma.id]);
		const removedGhosts: MatrixItem[] = this.layers.ghosts.filter((ghost) => ghostsToRemove[ghost.id]);
		const id = uuidv4();
		this.layers.removedItems[id] = removedGhosts.concat(...removedPlasma)
		this.layers.previousPlasma = this.layers.previousPlasma.filter((plasma) => !plasmaToRemove[plasma.id]);
		this.layers.ghosts = this.layers.ghosts.filter((ghost) => !ghostsToRemove[ghost.id]);
		this.countCatchGhosts(ghostsToRemove);
		this.score = this.score + points;
	};

	matchItemsPerRotation = {
		0: (plasma: LastPlasma) => this.matchLastPlasma(plasma),
		90: (plasma: LastPlasma) => {
			const matchingDerivedColorVertical = this.matchColorVertical(plasma.der.row, plasma.der.column);
			const matchingCurrentColorHorizontal = this.matchColorHorizontal(
				plasma.curr.row,
				plasma.curr.column
			);
			const matchingDerivedColorHorizontal = this.matchColorHorizontal(
				plasma.der.row,
				plasma.der.column
			);

			this.clearItems(matchingDerivedColorVertical);
			this.clearItems(matchingCurrentColorHorizontal);
			this.clearItems(matchingDerivedColorHorizontal);
		},
		180: (plasma: LastPlasma) => this.matchLastPlasma(plasma),
		270: (plasma: LastPlasma) => {
			const matchingCurrentColorVertical = this.matchColorVertical(plasma.curr.row, plasma.curr.column);
			const matchingCurrentColorHorizontal = this.matchColorHorizontal(
				plasma.curr.row,
				plasma.curr.column
			);
			const matchingDerivedColorHorizontal = this.matchColorHorizontal(
				plasma.der.row,
				plasma.der.column
			);

			this.clearItems(matchingCurrentColorVertical);
			this.clearItems(matchingCurrentColorHorizontal);
			this.clearItems(matchingDerivedColorHorizontal);
		}
	};

	matchLastPlasma(plasma: LastPlasma) {
		const matchingCurrentColorVertical = this.matchColorVertical(plasma.curr.row, plasma.curr.column);
		const matchingDerivedColorVertical = this.matchColorVertical(plasma.der.row, plasma.der.column);

		const matchingCurrentColorHorizontal = this.matchColorHorizontal(
			plasma.curr.row,
			plasma.curr.column
		);
		const matchingDerivedColorHorizontal = this.matchColorHorizontal(plasma.der.row, plasma.der.column);

		this.clearItems(matchingCurrentColorVertical);
		this.clearItems(matchingDerivedColorVertical);
		this.clearItems(matchingCurrentColorHorizontal);
		this.clearItems(matchingDerivedColorHorizontal);
	}

	plasmaEnded = () => {
		this.updatePreviousPlasma();
		this.resetPlasma();
		this.matchItemsPerRotation[this.rotation](this.lastPlasma!);
		this.checkEndLevel();
	}

	resetPlasma = () => {
		this.currentRow = this.initialRow;
		this.currentCol = this.initialCol;
		const pillColors = getRandomPill();
		this.flyingPlasmaColors.current = this.nextPlasmaColors.current;
		this.flyingPlasmaColors.derived = this.nextPlasmaColors.derived;
		this.nextPlasmaColors.current = pillColors.current;
		this.nextPlasmaColors.derived = pillColors.derived;
		this.rotation = 0;
	}

	// Current plasma
	currentPlasmaAtTheBottom = () => {
		if (this.rotation === 90) {
			return (this.derivedRow === this.lastRow)
		}
		return this.currentRow === this.lastRow;
	}

	private itemBelowHelper = {
		0: () => this.layers.matrix[this.currentRow + 1][this.currentCol] || this.layers.matrix[this.derivedRow + 1][this.derivedCol],
		90: () => this.layers.matrix[this.derivedRow + 1][this.derivedCol],
		180: () => this.layers.matrix[this.currentRow + 1][this.currentCol] || this.layers.matrix[this.derivedRow + 1][this.derivedCol],
		270: () => this.layers.matrix[this.currentRow + 1][this.currentCol]
	}

	isItemBelowCurrentPlasma =  () => {
		try {
			return this.itemBelowHelper[this.rotation]();
		} catch (e) {
			return true;
		}
	};

	canMovePlasmaDown = () => {
		if (this.isItemBelowCurrentPlasma()) {
			return false;
		}

		return !this.currentPlasmaAtTheBottom();
	}

	moveCurrentPlasmaDown = () => {
		if (!this.canMovePlasmaDown()) {
			this.plasmaEnded();
			return;
		}

		this.currentRow++;

		if (!this.canMovePlasmaDown()) {
			this.plasmaEnded();
			return;
		}
	}

	private isLeftCollision = {
		0: () => this.layers.matrix[this.currentRow][this.currentCol - 1],
		90: () => this.layers.matrix[this.currentRow][this.currentCol - 1] || this.layers.matrix[this.derivedRow][this.derivedCol - 1],
		180: () => this.layers.matrix[this.derivedRow][this.derivedCol - 1],
		270: () => this.layers.matrix[this.currentRow][this.currentCol - 1] || this.layers.matrix[this.derivedRow][this.derivedCol - 1],
	}

	private isRightCollision = {
		0: () => this.layers.matrix[this.currentRow][this.derivedCol + 1],
		90: () => this.layers.matrix[this.currentRow][this.currentCol + 1] || this.layers.matrix[this.derivedRow][this.derivedCol + 1],
		180: () => this.layers.matrix[this.derivedRow][this.currentCol + 1],
		270: () => this.layers.matrix[this.currentRow][this.currentCol + 1] || this.layers.matrix[this.derivedRow][this.derivedCol + 1],
	}

	private isRotateCollision = {
		0: () => false,
		90: () => this.layers.matrix[this.derivedRow][this.derivedCol + 1],
		180: () => false,
		270: () => this.layers.matrix[this.currentRow][this.currentCol + 1],
	}

	private rotationHandler: Record<number, () => void> = {
		0: () => {
			this.rotation = 270;
			this.left -= (this.offset / 2);
			this.topCorrection = this.offset / 2;
		},
		270: () => {
			this.rotation = 180;
			this.left += (this.offset / 2);
			this.topCorrection = 0;
			this.currentCol += 1;
		},
		180: () => {
			this.rotation = 90;
			this.left -= (this.offset / 2);
			this.topCorrection = -(this.offset / 2);
			this.currentRow -= 1;
			this.currentCol -= 1;
		},
		90: () => {
			this.rotation = 0;
			this.left += (this.offset / 2);
			this.topCorrection = 0;
			this.currentRow += 1;
		}
	}

	moveCurrentPlasmaLeft = () => {
		if (this.currentCol === 0 || this.derivedCol === 0) {
			return;
		}
		if (this.isLeftCollision[this.rotation]()) {
			return;
		}

		this.left -= this.offset;
		this.currentCol -= 1;
	}

	moveCurrentPlasmaRight = () => {
		if (this.currentCol === this.lastCol || this.derivedCol === this.lastCol) {
			return;
		}
		if (this.isRightCollision[this.rotation]()) {
			return;
		}

		this.left += this.offset;
		this.currentCol += 1;
	}

	rotateCurrentPlasma = () => {
		if ((this.currentRow === 0 && this.rotation !== 90)) {
			return;
		}
		if (this.currentCol === this.lastCol && (this.rotation === 270 || this.rotation === 90)) {
			return;
		}
		if (this.isRotateCollision[this.rotation]()) {
			return;
		}

		this.rotationHandler[this.rotation]();
	}

}

export default Game;
