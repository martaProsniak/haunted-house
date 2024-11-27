<script lang="ts">
    import {matrix, initialRow, initialCol, lastCol, currentRow, currentCol, rotation, derivedRow, derivedCol} from "./game.state.svelte";
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
            return 6000;
        }
        if (color === 'green') {
            return 5000;
        }
        return 10 * 60;
    })

    const moveUp = () => {
        console.log('Move up!', $state.snapshot(ghost));
        const {row, column} = ghost;

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
        // debugger;
    }

    const moveRight = () => {
        console.log('Move right!', $state.snapshot(ghost));
        const {row, column} = ghost;

        ghost.column = column + 1;
        matrix[row][column] = null
        $state.snapshot(matrix);
        // debugger;

    }

    const canMove = () => {
        const {row, column, color} = ghost;

        const topItem = matrix[row - 1][column];
        const bottom = matrix[row + 1][column];
        const leftItem = matrix[row][column - 1];
        const rightItem = matrix[row - 1][column + 1];


    }

    export const move = () => {
        const {row, column} = ghost;

        if (ghost.row === initialRow) {
            console.log('reached top', ghost.id)
            clearInterval(interval);
        }

        if (row - 1 === $currentRow || ($rotation === 90 && row - 1 === $derivedRow)) {
            return;
        }

        if (!matrix[row - 1][column]) {
            moveUp();
        } else if (!matrix[row][column + 1] && column < lastCol) {
            moveLeft();
        } else if (!matrix[row][column - 1] && column > initialCol) {
            moveRight();
        } else {
            console.log('Cannot move', ghost.color)
        }
    }

    onMount(() => {
        interval = setInterval(() => {
            move();
        }, speed);

        return () => {
            clearInterval(interval)
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
        /*border: 4px black solid;*/
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
    }
</style>