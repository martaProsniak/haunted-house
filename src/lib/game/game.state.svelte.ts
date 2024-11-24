import type {MatrixItem, Pill, Virus} from './types';
import { colors, getRandomColor } from './utils';

export const matrix: Array<Array<MatrixItem | null>> = $state(
	Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => null))
);

export const pillColors = $state({
    current: getRandomColor(),
    derived: getRandomColor(),
})