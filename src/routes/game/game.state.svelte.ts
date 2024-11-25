
import { getRandomColor } from './utils';

export const pillColors = $state({
    current: getRandomColor(),
    derived: getRandomColor(),
})