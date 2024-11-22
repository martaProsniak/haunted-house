import type { Pill, Virus } from './types';
import { colors, getRandomColor } from './utils';

export const previousPills: Pill[] = $state([]);

export const viruses: Virus[] = $state([
	{ type: 'virus', color: colors.yellow, id: 'virus-1', row: 13, column: 4 },
	{ type: 'virus', color: colors.pink, id: 'virus-2', row: 7, column: 6 },
	{ type: 'virus', color: colors.blue, id: 'virus-3', row: 9, column: 2 }
]);

export const pillColors = $state({
    current: getRandomColor(),
    derived: getRandomColor(),
})