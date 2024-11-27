<script lang="ts">
    import {matrix, initialRow, initialCol, lastCol} from "./game.state.svelte";
    import {onMount, unmount} from "svelte";
    import type {Ghost} from "./types";

    const {ghost, offset}: {ghost: Ghost, offset: number} = $props();
    let interval: ReturnType<typeof setInterval>;
    let speed = $derived.by(() => {
        const {color} = ghost;

        if (color === 'pink') {
            return 3000;
        }
        if (color === 'blue') {
            return 2000;
        }
        if (color === 'green') {
            return 5000;
        }
        return 10 * 60;
    })

    const moveUp = () => {
        const {row, column} = ghost;

        ghost.row = row - 1;
        matrix[row][column] = null
    }

    const moveLeft = () => {
        const {row, column} = ghost;

        ghost.column = column - 1;
        matrix[row][column - 1] = null
    }

    const moveRight = () => {
        const {row, column} = ghost;

        ghost.column = column + 1;
        matrix[row][column + 1] = null
    }

    export const move = () => {
        const {row, column} = ghost;

        if (ghost.row === initialRow) {
            clearInterval(interval);
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