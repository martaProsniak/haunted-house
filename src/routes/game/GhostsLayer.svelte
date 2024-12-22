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
        lives
    } from "./gameState.svelte.js";
    import GhostSprite from './Ghost.svelte'
    import type {Ghost} from "./types";
    import {checkResult, clearItems, matchColorHorizontal, matchColorVertical} from "./matchItems.helpers";
    import {ghostsGifs, ghostsImages} from "./constants";

    const {offset} = $props();
    let freeGhosts = $derived.by(() => {
        return layers.ghosts.filter((ghost) => !ghost.isGlued);
    })
    const moveCount = 1;
    let ghostsToMove: Ghost[] = [];
    let animationFrameId: number;
    let lastFrameTime: number | null = null;
    let frequency = $state(2000);

    const scheduleMovement = () => {
        const animateMovement = (timestamp: number) => {
            if (lastFrameTime === null) {
                lastFrameTime = timestamp;
            }

            if (timestamp - lastFrameTime >= frequency) {
                lastFrameTime = timestamp;
                ghostsToMove.forEach((ghost) => {
                    ghost.imageUrl = ghostsGifs[ghost.color];
                    moveGhost(ghost);
                });
            }

            if ($gameStatus === 'playing') {
                animationFrameId = requestAnimationFrame(animateMovement);
            }
        };

        animationFrameId = requestAnimationFrame(animateMovement);
    };


    const checkResultAfterMove = () => {
        const result = checkResult();
        if (result) {
            $gameStatus = result;
            stopAnimation();
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
            $lives--;
            layers.ghosts = layers.ghosts.filter((ghost) => ghost.id !== id);
            checkResultAfterMove();
            return;
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

    const stopAnimation = () => {
        cancelAnimationFrame(animationFrameId);
        lastFrameTime = null;
    }

    $effect(() => {
        if ($gameStatus === 'playing') {
            if (!freeGhosts.length) {
                return;
            }
            prepareGhostsToMove();
            scheduleMovement();
        }

        if ($gameStatus === 'success' || $gameStatus === 'failure') {
            ghostsToMove = [];
        }

        return () => {
            stopAnimation();
        };
    });
</script>

<div class="absolute">
    {#each layers.ghosts as ghost (ghost.id)}
        <GhostSprite {ghost} {offset} />
    {/each}
</div>
