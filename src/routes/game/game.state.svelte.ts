
import {type Writable, writable} from "svelte/store";
import {colors, getRandomColor} from './utils';
import type {Ghost, Matrix, Plasma, Rotation} from "./types";

import blueGhost from '$lib/assets/ghost-blue.png'
import pinkGhost from '$lib/assets/ghost-pink.png'
import greenGhost from '$lib/assets/ghost-green.png'

export const flyingPlasmaColors = $state({
    current: getRandomColor(),
    derived: getRandomColor(),
})

export const rowsCount = 16;
export const colsCount = 16;
export const initialRow = 0;
export const initialCol = 7;
export const lastRow = rowsCount - 1;
export const lastCol = colsCount - 1;

export const matrix: Matrix = $state(
    Array.from(Array(rowsCount).keys()).map(() => Array.from(Array(colsCount).keys()).map(() => null))
);

export const currentRow = writable(initialRow);
export const currentCol = writable(initialCol);
export const rotation: Writable<Rotation> = writable(0);

const initialGhosts: Ghost[] = [
    {type: 'ghost', color: colors.green, id: 'ghost-1', row: 13, column: 10, imageUrl: greenGhost},
    {type: 'ghost', color: colors.pink, id: 'ghost-2', row: 7, column: 6, imageUrl: pinkGhost},
    {type: 'ghost', color: colors.blue, id: 'ghost-3', row: 9, column: 12, imageUrl: blueGhost}
]

interface GameLayers {
    ghosts: Ghost[],
    previousPlasma: Plasma[]
}

export const layers: GameLayers = $state({
    ghosts: initialGhosts,
    previousPlasma: []
})