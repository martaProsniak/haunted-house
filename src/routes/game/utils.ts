import type { Color } from './types';

import greenPlasma from '$lib/assets/plasma-green.png';
import pinkPlasma from '$lib/assets/plasma-pink.png';
import bluePlasma from '$lib/assets/plasma-blue.png';

export const colors: Record<string, Color> = {
	pink: 'pink',
	blue: 'blue',
	green: 'green'
};

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

export const plasmaImages: Record<Color, string>= {
	pink: pinkPlasma,
	blue: bluePlasma,
	green: greenPlasma,
} as const;