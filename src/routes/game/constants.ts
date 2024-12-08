import type { Color } from './types';
import pinkPlasma from '$lib/assets/plasma-pink.png';
import bluePlasma from '$lib/assets/plasma-blue.png';
import greenPlasma from '$lib/assets/plasma-green.png';
import pinkGhost from '$lib/assets/ghost-pink.png';
import blueGhost from '$lib/assets/ghost-blue.png';
import greenGhost from '$lib/assets/ghost-green.png';
import pinkGhostGif from '$lib/assets/ghost-pink.gif';
import blueGhostGif from '$lib/assets/ghost-blue.gif';
import greenGhostGif from '$lib/assets/ghost-green.gif';
import pinkGhostGlued from '$lib/assets/ghost-pink-glued.png';
import blueGhostGlued from '$lib/assets/ghost-blue-glued.png';
import greenGhostGlued from '$lib/assets/ghost-green-glued.png';
import plasmaPinkPink from '$lib/assets/flying-pink-pink.png';
import plasmaPinkBlue from '$lib/assets/flying-pink-blue.png';
import plasmaPinkGreen from '$lib/assets/flying-pink-green.png';
import plasmaBluePink from '$lib/assets/flying-blue-pink.png';
import plasmaBlueBlue from '$lib/assets/flying-blue-blue.png';
import plasmaBlueGreen from '$lib/assets/flying-blue-green.png';
import plasmaGreenPink from '$lib/assets/flying-green-pink.png';
import plasmaGreenBlue from '$lib/assets/flying-green-blue.png';
import plasmaGreenGreen from '$lib/assets/flying-green-green.png';

export const mapColorsToHex = {
	pink: '#ec3597',
	green: '#45e732',
	blue: '#2398ec'
};
export const colors: Record<string, Color> = {
	pink: 'pink',
	blue: 'blue',
	green: 'green'
} as const;
export const plasmaImages: Record<Color, string> = {
	pink: pinkPlasma,
	blue: bluePlasma,
	green: greenPlasma
} as const;
export const ghostsImages: Record<Color, string> = {
	pink: pinkGhost,
	blue: blueGhost,
	green: greenGhost
} as const;
export const ghostsImagesGlued: Record<Color, string> = {
	pink: pinkGhostGlued,
	blue: blueGhostGlued,
	green: greenGhostGlued
} as const;
export const ghostsGifs: Record<Color, string> = {
	pink: pinkGhostGif,
	blue: blueGhostGif,
	green: greenGhostGif
} as const;
export const flyingPlasmaImages = {
	pink: {
		pink: plasmaPinkPink,
		blue: plasmaPinkBlue,
		green: plasmaPinkGreen
	},
	blue: {
		pink: plasmaBluePink,
		blue: plasmaBlueBlue,
		green: plasmaBlueGreen
	},
	green: {
		pink: plasmaGreenPink,
		blue: plasmaGreenBlue,
		green: plasmaGreenGreen
	}
};