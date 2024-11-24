import type {PillPosition, Rotation} from "$lib/game/types";

export const derivePillPosition = (rotation: Rotation) => {
    if (rotation === 90) {
        return 'verticalFlipped';
    }
    if (rotation === 270) {
        return 'vertical';
    }
    return 'horizontal';
}

export const deriveRow = (pillPosition: PillPosition, currentRow: number) => {
    if (pillPosition === 'verticalFlipped') {
        return currentRow + 1;
    }
    if (pillPosition === 'vertical') {
        return currentRow - 1;
    }
    return currentRow;
}

export const deriveColumn = (rotation: Rotation, currentColumn: number) => {
    if (rotation === 0) {
        return currentColumn + 1;
    }

    if (rotation === 180) {
        return currentColumn - 1
    }

    return currentColumn;
}