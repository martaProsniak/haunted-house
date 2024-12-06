<script lang="ts">
    import type {MatrixItem, Plasma} from "./types";
    import {fade, scale} from 'svelte/transition'
    import {currentRow, lastCol, lastRow, layers, gameStatus, isPaused} from "./game.state.svelte";
    import {
        findNextMatchingItemDown,
        findNextMatchingItemLeft,
        findNextMatchingItemRight,
        findNextMatchingItemUp
    } from "./utils";

    interface Props {
        plasma: Plasma;
        offset: number;
    }

    const {plasma, offset}: Props = $props();

    let interval: ReturnType<typeof setInterval>;

    let neighbors = $derived.by(() => {
        return {
            top: plasma.row === 0 ? null : layers.matrix[plasma.row - 1][plasma.column],
            right: plasma.column === lastCol ? null : layers.matrix[plasma.row][plasma.column + 1],
            bottom: plasma.row === lastRow ? null : layers.matrix[plasma.row + 1][plasma.column],
            left: plasma.row === 0 ? null : layers.matrix[plasma.row][plasma.column - 1],
        }
    })

    let canMoveDown = $derived.by(() => {
        if (plasma.row + 1 === $currentRow) return false;
        return !neighbors.bottom;
    })

    const clearItems = (matchingItems: MatrixItem[]) => {
        if (matchingItems.length < 4) {
            return;
        }

        const plasmaToRemove: Record<string, MatrixItem> = {};
        const ghostsToRemove: Record<string, MatrixItem> = {};

        matchingItems.forEach((item => {
            layers.matrix[item.row][item.column] = null;
            if (item.type === 'ghost') {
                ghostsToRemove[item.id] = item;
            }
            if (item.type === 'plasma') {
                plasmaToRemove[item.id] = item
            }
        }))

        layers.previousPlasma = layers.previousPlasma.filter((plasma) => !plasmaToRemove[plasma.id]);
        layers.ghosts = layers.ghosts.filter((ghost) => !ghostsToRemove[ghost.id]);
        countCatchGhosts(ghostsToRemove);

        if (layers.ghosts.length) {
            return;
        }

        checkResult();
    }

    const checkResult = () => {
        const anyGhostCatch = Object.values(layers.catchGhosts).some((value) => value > 0);
        $gameStatus = anyGhostCatch ? 'success' : 'failure';

    }

    const countCatchGhosts = (ghosts: Record<string, MatrixItem>) => {
        Object.values(ghosts).forEach((ghost) => {
            layers.catchGhosts[ghost.color]++
        })
    }

    const matchCurrentColorVertical = () => {
        const itemInMatrix = layers.matrix[plasma.row][plasma.column];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemDown(plasma.row + 1, plasma.column, color, matchingItems);
        findNextMatchingItemUp(plasma.row - 1, plasma.column, color, matchingItems);

        return matchingItems;
    }

    const matchCurrentColorHorizontal = () => {
        const itemInMatrix = layers.matrix[plasma.row][plasma.column];
        if (!itemInMatrix) {
            return [];
        }
        const {color} = itemInMatrix;
        const matchingItems: MatrixItem[] = [itemInMatrix];
        findNextMatchingItemLeft(plasma.row, plasma.column - 1, color, matchingItems);
        findNextMatchingItemRight(plasma.row, plasma.column + 1, color, matchingItems);

        return matchingItems;
    }

    const matchItems = () => {
        const matchingTop = matchCurrentColorVertical();
        const matchingHorizontal = matchCurrentColorHorizontal();

        clearItems(matchingTop);
        clearItems(matchingHorizontal);
    }

    $effect(() => {
        if (!plasma) {
            return;
        }
        interval = setInterval(() => {
            if (plasma.row === lastRow) {
                clearInterval(interval);
                return;
            }
            if ($gameStatus !== 'playing') {
                return;
            }
            if ($isPaused) {
                console.log('Paused')
                return;
            }
            if (canMoveDown) {
                layers.matrix[plasma.row][plasma.column] = null;
                layers.matrix[plasma.row + 1][plasma.column] = plasma;
                plasma.row++;
                matchItems();
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        }


    })
</script>

<div
        style:background-image={`url("${plasma.imageUrl}")`}
        style:top={`${plasma.row * offset}px`}
        style:left={`${plasma.column * offset}px`}
        class="plasma-previous"
        out:fade={{ duration: 200 }} in:scale={{duration: 200}}>
</div>

<style>
    .plasma-previous {
        width: 40px;
        height: 40px;
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        font-size: 12px;
    }
</style>