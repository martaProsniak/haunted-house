
import {colors, getRandomColor} from './utils';
import type {Ghost, Matrix, Pill} from "./types";

export const pillColors = $state({
    current: getRandomColor(),
    derived: getRandomColor(),
})

export const rowsCount = 16;
export const colsCount = 16;

export const matrix: Matrix = $state(
    Array.from(Array(rowsCount).keys()).map(() => Array.from(Array(colsCount).keys()).map(() => null))
);

const initialGhosts: Ghost[] = [
    {type: 'ghost', color: colors.yellow, id: 'ghost-1', row: 13, column: 10},
    {type: 'ghost', color: colors.pink, id: 'ghost-2', row: 7, column: 6},
    {type: 'ghost', color: colors.blue, id: 'ghost-3', row: 9, column: 12}
]

interface GameLayers {
    ghosts: Ghost[],
    previousPills: Pill[]
}

export const layers: GameLayers = $state({
    ghosts: initialGhosts,
    previousPills: []
})