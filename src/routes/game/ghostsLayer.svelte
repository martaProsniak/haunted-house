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
        lastCol,
        gameInterval,
    } from "./gameState.svelte.js";
    import GhostSprite from './ghost.svelte'
    import type {Ghost, Matrix} from "./types";
    import {ghostsGifs, ghostsImages} from "./constants";

    const {offset, matrix}: {offset: number, matrix: Matrix} = $props()
    let interval: ReturnType<typeof setInterval>;
    let freeGhosts = $derived.by(() => {
        return layers.ghosts.filter((ghost) => !ghost.isGlued);
    })
    let moveCount = $derived.by(() => Math.min(Math.ceil($level / 2), 3));
    let ghostsToMove: Ghost[] = [];


    const scheduleMovement = () => {
        interval = setInterval(() => {
            ghostsToMove.forEach((ghost) => {
                ghost.imageUrl = ghostsGifs[ghost.color]
                moveGhost(ghost);
            })
        }, $gameInterval * 2);
    }

    const updateAfterMove = (ghost: Ghost) => {
        ghost.hasMoved = true;
        ghost.imageUrl = ghostsImages[ghost.color];
    }

    const moveUp = (ghost: Ghost) => {
        const {row, id} = ghost;

        if (row === initialRow) {
            layers.escapedGhosts[ghost.id] = ghost;
            layers.ghosts = layers.ghosts.filter((ghost) => ghost.id !== id);
        }

        if (ghost.hasPillAbove) {
            return;
        }

        ghost.row = row - 1;
    }

    const moveLeft = (ghost: Ghost) => {
        const {column} = ghost;

        ghost.column = column - 1;
    }

    const moveRight = (ghost: Ghost) => {
        const {column} = ghost;

        ghost.column = column + 1;
    }

    const moveGhost = (ghost: Ghost) => {
        if ($isPaused) {
            return;
        }

        if (ghost.isGlued || isBlocked(ghost)) {
            ghost.hasMoved = true;
            return;
        }

        const {row, column, neighbors} = ghost;

        if (row - 1 === $currentRow || ($rotation === 90 && row - 1 === $derivedRow)) {
            return;
        }

        if (!neighbors.top) {
            moveUp(ghost);
        } else if (!neighbors.right && column !== lastCol) {
            moveRight(ghost);
        } else if (!neighbors.left && column > 0) {
            moveLeft(ghost);
        }

        updateAfterMove(ghost);

    }

    const isBlocked = ({neighbors}: Ghost) => {
        return neighbors.top && neighbors.right && neighbors.left
    }

    const prepareGhostsToMove = () => {
        ghostsToMove = freeGhosts.filter((ghost) => !ghost.hasMoved).slice(0, moveCount);
        if (!ghostsToMove.length) {
            ghostsToMove = freeGhosts.map((ghost) => {
                ghost.hasMoved = false;
                return ghost;
            }).slice(0, moveCount);
        }
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
        <GhostSprite {ghost} {matrix} {offset} />
    {/each}
</div>
