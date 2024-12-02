<script lang="ts">
    import {
        layers,
        gameStatus,
        level,
        isPaused,
        initialRow,
        currentRow,
        rotation,
        derivedRow,
        lastCol
    } from "./game.state.svelte";
    import GhostSprite from './ghost.svelte'
    import type {Ghost} from "./types";
    import {ghostsGifs, ghostsImages} from "./utils";

    const {offset} = $props();
    let interval: ReturnType<typeof setInterval>;
    let freeGhosts = $derived.by(() => {
        return layers.ghosts.filter((ghost) => !ghost.isGlued);
    })
    let moveCount = $derived.by(() => Math.min(Math.ceil($level / 3), 5));
    let ghostsToMove: Ghost[] = [];


    const scheduleMovement = () => {
        interval = setInterval(() => {
            console.log('Interval')
            ghostsToMove.forEach((ghost) => {
                ghost.imageUrl = ghostsGifs[ghost.color]
                moveGhost(ghost);
            })
        }, 1000);
    }

    const moveUp = (ghost: Ghost) => {
        const {row, column, id} = ghost;

        if (row === 0) {
            layers.escapedGhosts[ghost.color]++;
            layers.ghosts = layers.ghosts.filter((ghost) => ghost.id !== id);
            layers.matrix[row][column] = null;
        }

        if (ghost.hasPillAbove) {
            return;
        }

        ghost.row = row - 1;
        layers.matrix[row][column] = null
        ghost.hasMoved = true;
        ghost.imageUrl = ghostsImages[ghost.color]
    }

    const moveLeft = (ghost: Ghost) => {
        const {row, column} = ghost;

        ghost.column = column - 1;
        layers.matrix[row][column] = null
        ghost.hasMoved = true;
        ghost.imageUrl = ghostsImages[ghost.color]
    }

    const moveRight = (ghost: Ghost) => {
        const {row, column} = ghost;

        ghost.column = column + 1;
        layers.matrix[row][column] = null
        ghost.hasMoved = true;
        ghost.imageUrl = ghostsImages[ghost.color]

    }

    const moveGhost = (ghost: Ghost) => {
        if ($isPaused) {
            return;
        }

        const {row, column, color, neighbors} = ghost;

        if (row - 1 === $currentRow || ($rotation === 90 && row - 1 === $derivedRow)) {
            return;
        }

        if (!neighbors.top) {
            moveUp(ghost);
        } else if (!neighbors.right && column !== lastCol) {
            moveRight(ghost);
        } else if (!neighbors.left && column > 0) {
            moveLeft(ghost);
        } else console.log('Cannot move', color);

    }

    const isBlocked = ({neighbors}: Ghost) => {
        return neighbors.top && neighbors.right && neighbors.left
    }

    const prepareGhostsToMove = () => {
        ghostsToMove = freeGhosts.filter((ghost) => !ghost.hasMoved && !isBlocked(ghost)).slice(0, moveCount);
        if (!ghostsToMove.length) {
            ghostsToMove = freeGhosts.map((ghost) => {
                ghost.hasMoved = false;
                return ghost;
            }).slice(0, moveCount);
        }
        console.log(ghostsToMove);
        ghostsToMove.forEach((ghost) => {
            ghost.imageUrl = ghostsGifs[ghost.color]
        })

    }

    $effect(() => {
        if ($gameStatus === 'playing') {
            if (!freeGhosts.length) {
                return
            }
            prepareGhostsToMove();
            scheduleMovement();
        }

        if ($gameStatus === 'success' || $gameStatus === 'failure') {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        }
    })
</script>

<div class="absolute">
    {#each layers.ghosts as ghost}
        <GhostSprite {ghost} {offset} />
    {/each}
</div>
