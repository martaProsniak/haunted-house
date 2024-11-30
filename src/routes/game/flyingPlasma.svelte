<script lang="ts">
    import {getRandomPill} from "./utils";
    import {flyingPlasmaColors, matrix, currentRow, currentCol, rotation, derivedRow, derivedCol, gameStatus} from "./game.state.svelte.js";
    import plasmaBlueBlue from '$lib/assets/flying-blue-blue.png';
    import plasmaPinkPink from '$lib/assets/flying-pink-pink.png';
    import plasmaGreenGreen from '$lib/assets/flying-green-green.png';
    import plasmaGreenBlue from '$lib/assets/flying-green-blue.png';
    import plasmaGreenPink from '$lib/assets/flying-green-pink.png';
    import plasmaBluePink from '$lib/assets/flying-blue-pink.png';
    import plasmaPinkBlue from '$lib/assets/flying-pink-blue.png';
    import plasmaPinkGreen from '$lib/assets/flying-pink-green.png';
    import plasmaBlueGreen from '$lib/assets/flying-blue-green.png';

    const flyingPlasmaImages = {
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

    interface Props {
        initialTop: number,
        initialLeft: number,
        lastRow: number,
        lastCol: number
    }

    const offset = 44;
    let {
        initialTop,
        initialLeft,
        lastRow,
        lastCol
    }: Props = $props();
    let left = $state(initialLeft);
    let topCorrection = $state(0);
    let top = $derived(initialTop + (offset * $currentRow) - topCorrection);
    let hidden = $derived($gameStatus !== 'playing' && $gameStatus !== 'paused');

    console.log($gameStatus);
    console.log(hidden)

    const itemBelowHelper = {
        0: () => matrix[$currentRow + 1][$currentCol] || matrix[$derivedRow + 1][$derivedCol],
        90: () => matrix[$derivedRow + 1][$derivedCol],
        180: () => matrix[$currentRow + 1][$currentCol] || matrix[$derivedRow + 1][$derivedCol],
        270: () => matrix[$currentRow + 1][$currentCol]
    }

    const isLastRow = () => {
        if ($rotation === 90) {
            return ($derivedRow === lastRow)
        }
        return $currentRow === lastRow;
    };

    const isItemBelow = () => {
        try {
            return itemBelowHelper[$rotation]();
        } catch (e) {
            return true;
        }
    };

    export const canMoveDown = () => {
        if (isItemBelow()) {
            return false;
        }

        return !isLastRow();
    };

    const rotationHandler: Record<number, () => void> = {
        0: () => {
            $rotation = 270;
            left -= (offset / 2);
            topCorrection = offset / 2;
        },
        270: () => {
            $rotation = 180;
            left += (offset / 2);
            topCorrection = 0;
            $currentCol += 1;
        },
        180: () => {
            $rotation = 90;
            left -= (offset / 2);
            topCorrection = -(offset / 2);
            $currentRow -= 1;
            $currentCol -= 1;
        },
        90: () => {
            $rotation = 0;
            left += (offset / 2);
            topCorrection = 0;
            $currentRow += 1;
        }
    }

    const isLeftCollision = {
        0: () => matrix[$currentRow][$currentCol - 1],
        90: () => matrix[$currentRow][$currentCol - 1] || matrix[$derivedRow][$derivedCol - 1],
        180: () => matrix[$derivedRow][$derivedCol - 1],
        270: () => matrix[$currentRow][$currentCol - 1] || matrix[$derivedRow][$derivedCol - 1],
    }

    const isRightCollision = {
        0: () => matrix[$currentRow][$derivedCol + 1],
        90: () => matrix[$currentRow][$currentCol + 1] || matrix[$derivedRow][$derivedCol + 1],
        180: () => matrix[$derivedRow][$currentCol + 1],
        270: () => matrix[$currentRow][$currentCol + 1] || matrix[$derivedRow][$derivedCol + 1],
    }

    const isRotateCollision = {
        0: () => false,
        90: () => matrix[$derivedRow][$derivedCol + 1],
        180: () => false,
        270: () => matrix[$currentRow][$currentCol + 1],
    }

    export const moveDown = () => {
        $currentRow += 1;
    }

    export const moveLeft = () => {
        if ($currentCol === 0 || $derivedCol === 0) {
            return;
        }
        if (isLeftCollision[$rotation]()) {
            return;
        }

        left -= offset;
        $currentCol -= 1;
    }

    export const moveRight = () => {
        if ($currentCol === lastCol || $derivedCol === lastCol) {
            return;
        }
        if (isRightCollision[$rotation]()) {
            return;
        }

        left += offset;
        $currentCol += 1;
    }

    export const rotate = () => {
        if (($currentRow === 0 && $rotation !== 90)) {
            return;
        }
        if ($currentCol === lastCol && ($rotation === 270 || $rotation === 90)) {
            return;
        }
        if (isRotateCollision[$rotation]()) {
            return;
        }

        rotationHandler[$rotation]();
    }

    export const reset = () => {
        const pillColors = getRandomPill();
        flyingPlasmaColors.current = pillColors.current;
        flyingPlasmaColors.derived = pillColors.derived;
        $rotation = 0;
        topCorrection = 0;
        left = initialLeft;
    }

</script>

<div
        style:top={`${top}px`}
        style:left={`${left}px`}
        style:transform="{`rotate(${$rotation}deg`}"
        class="pill"
        class:hidden
        style:background-image={`url("${flyingPlasmaImages[flyingPlasmaColors.current][flyingPlasmaColors.derived]}")`}>
</div>

<style>
    .pill {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 84px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;
        transition: transform 0.1s linear;
    }

    .hidden {
        display: none;
    }
</style>