import type { Color } from './types';

import greenPlasma from '$lib/assets/plasma-green.png';
import pinkPlasma from '$lib/assets/plasma-pink.png';
import bluePlasma from '$lib/assets/plasma-blue.png';

import blueGhost from '$lib/assets/ghost-blue.png';
import pinkGhost from '$lib/assets/ghost-pink.png';
import greenGhost from '$lib/assets/ghost-green.png';

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

export const ghostsImages: Record<Color, string>= {
	pink: pinkGhost,
	blue: blueGhost,
	green: greenGhost,
} as const;

export const getRandomColor = () => {
	return Object.values(colors)[Math.floor(Math.random() * Object.values(colors).length)];
}

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
}