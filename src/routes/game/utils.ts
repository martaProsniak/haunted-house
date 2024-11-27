import type { Color } from './types';

import greenPlasma from '$lib/assets/plasma-green.png';
import pinkPlasma from '$lib/assets/plasma-pink.png';
import bluePlasma from '$lib/assets/plasma-blue.png';

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

// export const borderKind = {
// 	left: 'border-stone-800 border-y-2 border-l-2 rounded-l-2xl',
// 	right: 'border-stone-800 border-y-2 border-r-2 rounded-r-2xl',
// 	top: 'border-stone-800 border-x-2 border-t-2 rounded-t-2xl',
// 	bottom: 'border-stone-800 border-x-2 border-b-2 rounded-b-2xl'
// } as const;

export function getRandomColor() {
	return Object.values(colors)[Math.floor(Math.random() * 3)];
}
//
// export const pillBorders = {
// 	0: {
// 		state: borderKind.left,
// 		derived: borderKind.right
// 	},
// 	180: {
// 		state: borderKind.right,
// 		derived: borderKind.left
// 	},
// 	270: {
// 		state: borderKind.bottom,
// 		derived: borderKind.top
// 	},
// 	90: {
// 		state: borderKind.top,
// 		derived: borderKind.bottom
// 	}
// };