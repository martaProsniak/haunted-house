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
    } from "./gameState.svelte.js";
    import GhostSprite from './ghost.svelte'
    import type {Ghost} from "./types";
    import {checkResult, clearItems, matchColorHorizontal, matchColorVertical} from "./matchItems.helpers";
    import {ghostsGifs, ghostsImages} from "./constants";

    const {offset} = $props();
    let interval: ReturnType<typeof setInterval>;
    let freeGhosts = $derived.by(() => {
        return layers.ghosts.filter((ghost) => !ghost.isGlued);
    })
    let moveCount = $derived.by(() => Math.min(Math.ceil($level / 3), 5));
    let ghostsToMove: Ghost[] = [];


    const scheduleMovement = () => {
        interval = setInterval(() => {
            ghostsToMove.forEach((ghost) => {
                ghost.imageUrl = ghostsGifs[ghost.color]
                moveGhost(ghost);
            })
        }, 2000);
    }

    const checkResultAfterMove = () => {
        const result = checkResult();
        if (result) {
            $gameStatus = result;
            clearInterval(interval);
        }
    }


    const matchItems = (ghost: Ghost) => {
        const matchingTop = matchColorVertical(ghost.row, ghost.column);
        const matchingHorizontal = matchColorHorizontal(ghost.row, ghost.column);

        clearItems(matchingTop);
        clearItems(matchingHorizontal);
        checkResultAfterMove();
    }

    const updateAfterMove = (ghost: Ghost) => {
        ghost.hasMoved = true;
        ghost.imageUrl = ghostsImages[ghost.color];
        matchItems(ghost);
    }

    const moveUp = (ghost: Ghost) => {
        const {row, column, id} = ghost;

        if (row === initialRow) {
            layers.escapedGhosts[ghost.id] = ghost;
            layers.ghosts = layers.ghosts.filter((ghost) => ghost.id !== id);
            checkResultAfterMove();
        }

        if (ghost.hasPillAbove) {
            return;
        }

        layers.matrix[row][column] = null;
        layers.matrix[row-1][column] = ghost;
        ghost.row = row - 1;
    }

    const moveLeft = (ghost: Ghost) => {
        const {row, column} = ghost;

        layers.matrix[row][column] = null;
        layers.matrix[row][column - 1] = ghost;
        ghost.column = column - 1;
    }

    const moveRight = (ghost: Ghost) => {
        const {row, column} = ghost;

        layers.matrix[row][column] = null;
        layers.matrix[row][column + 1] = ghost;
        ghost.column = column + 1;
    }

    const moveGhost = (ghost: Ghost) => {
        if ($isPaused) {
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
        ghostsToMove = freeGhosts.filter((ghost) => !ghost.hasMoved && !isBlocked(ghost)).slice(0, moveCount);
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
        <GhostSprite {ghost} {offset} />
    {/each}
</div>
