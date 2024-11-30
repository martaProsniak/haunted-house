<script lang="ts">
    import {
        matrix,
        initialRow,
        initialCol,
        lastCol,
        currentRow,
        currentCol,
        rotation,
        derivedRow,
        derivedCol,
        lastRow,
        gameStatus
    } from "./game.state.svelte";
    import {onMount} from "svelte";
    import type {Ghost} from "./types";

    interface Props {
        ghost: Ghost,
        offset: number,
    }

    const {ghost, offset}: Props = $props();
    let interval: ReturnType<typeof setInterval>;
    let speed = $derived.by(() => {
        const {color} = ghost;

        if (color === 'pink') {
            return 3000;
        }
        if (color === 'blue') {
            return 8000;
        }
        if (color === 'green') {
            return 5000;
        }
        return 10 * 60;
    })

    let neighbors = $derived.by(() => {
        return {
            top: ghost.row === 0 ? null : matrix[ghost.row - 1][ghost.column],
            right: ghost.column === lastCol ? null : matrix[ghost.row][ghost.column + 1],
            bottom: ghost.row === lastRow ? null : matrix[ghost.row + 1][ghost.column],
            left: ghost.row === 0 ? null : matrix[ghost.row][ghost.column - 1],
        }
    })

    let isGlued = $derived.by(() => {
        return Object.values(neighbors).some((neighbour) => neighbour?.color === ghost.color)
    })

    let hasPillAbove = $derived.by(() => {
        if ($rotation === 0 || $rotation === 180) {
            return ghost.row - 1 === $currentRow && (ghost.column === $currentCol || ghost.column === $derivedCol);
        }
        if ($rotation === 270) {
            return ghost.row - 1 === $currentRow && (ghost.column === $currentCol);
        }
        if ($rotation === 90) {
            return ghost.row - 1 === $derivedRow && (ghost.column === $derivedCol);
        }
    })

    const moveUp = () => {
        console.log('Move up!', $state.snapshot(ghost));
        const {row, column} = ghost;

        if (row === 0) {
            console.log('Ghost ended!', ghost.color);
        }

        if (hasPillAbove) {
            return;
        }

        ghost.row = row - 1;
        matrix[row][column] = null
        $state.snapshot(matrix);
        // debugger;
    }

    const moveLeft = () => {
        console.log('Move left!', $state.snapshot(ghost));
        const {row, column} = ghost;

        ghost.column = column - 1;
        matrix[row][column] = null
        $state.snapshot(matrix);
    }

    const moveRight = () => {
        console.log('Move right!', $state.snapshot(ghost));
        const {row, column} = ghost;

        ghost.column = column + 1;
        matrix[row][column] = null
        $state.snapshot(matrix);

    }

    export const move = () => {
        if ($gameStatus === 'paused') {
            return;
        }

        console.log($state.snapshot(neighbors));
        if (isGlued) {
            return;
        }

        const {row, column, color} = ghost;

        if (ghost.row === initialRow) {
            console.log('reached top', ghost.id)
            clearInterval(interval);
        }

        if (row - 1 === $currentRow || ($rotation === 90 && row - 1 === $derivedRow)) {
            return;
        }

        if (!neighbors.top) {
            moveUp();
        } else if (!neighbors.right && column !== lastCol) {
            moveRight();
        } else if (!neighbors.left && column > 0) {
            moveLeft();
        } else console.log('Cannot move', color);
    }

    onMount(() => {
        interval = setInterval(() => {
            move();
        }, speed);

        return () => {
            clearInterval(interval)
        }
    })

    $effect(() => {
        if ($gameStatus === 'success' || $gameStatus === 'failure') {
            clearInterval(interval);
        }
    })

</script>

<div
        class="ghost"
        style:background-image={`url("${ghost.imageUrl}")`}
        style:top={`${ghost.row * offset}px`}
        style:left={`${ghost.column * offset}px`}
></div>

<style>
    .ghost {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
    }
</style>