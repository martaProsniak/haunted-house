<script lang="ts">
    import PlasmaLayer from './plasmaLayer.svelte';
    import GhostsLayer from './ghostsLayer.svelte';
    import FlyingPlasma from './flyingPlasma.svelte';
    import Board from './board.svelte';
    import GhostsInfo from './ghostsInfo.svelte';
    import Score from './score.svelte';
    import EndLevel from "./endLevel.svelte";
    import NextPlasma from './nextPlasma.svelte';
    import RemovedLayer from './removedItems.svelte';
    import {onMount} from "svelte";
    import Game from "./GameModel.svelte.js"

    let game: Game = $state(new Game());

    let animationFrameId: number | null = null;
    let lastFrameTime: number | null = null;

    onMount(() => {
        console.log(game.level);
        console.log(game.currentRow)
    })

    $effect(() => {
        game.updateMatrix();
    });

    $effect(() => {
        console.log('effect')
        if (game.gameStatus === 'started') {
            console.log('Started')
            game.prepareLevel();
        }

        if (game.isPlaying) {
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(animateLevel);
            }
        }

        if (game.isEndLevel && animationFrameId !== null) {
            cancelAnimation();
        }

        return () => {
            if (animationFrameId !== null) {
                cancelAnimation();
            }
        };
    });

    const cancelAnimation = () => {
        if (animationFrameId === null) {
            return;
        }
        cancelAnimationFrame(animationFrameId);
        lastFrameTime = null;
        animationFrameId = null;
    }

    const animateLevel = (currentTime: number) => {
        if (!lastFrameTime) {
            lastFrameTime = currentTime;
        }

        const delta = currentTime - lastFrameTime;

        if (game.isPlaying && delta >= 1000) {
            game.loop();

            lastFrameTime = currentTime;
        }

        if (game.isPlaying) {
            animationFrameId = requestAnimationFrame(animateLevel);
        }
    };

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key.startsWith('Arrow')) {
            ev.preventDefault();
        }

        if (!game.isPlaying || game.isPaused) {
            return;
        }

        if (ev.key === 'ArrowLeft') {
            game.moveCurrentPlasmaLeft();
        }

        if (ev.key === 'ArrowRight') {
            game.moveCurrentPlasmaRight();
        }

        if (ev.key === 'ArrowDown') {
            game.moveCurrentPlasmaDown();
        }

        if (ev.key === 'ArrowUp') {
            game.rotateCurrentPlasma();
        }
    }
</script>

<svelte:document on:keydown={handleKeyDown}></svelte:document>

<div class="container mx-auto h-full">
    <div class="ghosts">
        <GhostsInfo restartLevel={game.restartLevel} togglePause={game.togglePause} startGame={game.startGame}
                    isPlaying={game.isPlaying} isPaused={game.isPaused}/>
        <NextPlasma/>
    </div>
    <div class=" w-fit h-fit bg-zinc-950 flex flex-nowrap flex-col gap-1 p-1 relative board">
        <Board/>
        {#if game}
            <FlyingPlasma top={game.top} left={game.left}
                          flyingPlasmaColors={game.flyingPlasmaColors} rotation={game.rotation} isPaused={game.isPaused}
                          isPlaying={game.isPlaying}/>
            <GhostsLayer offset={game.offset}/>
            <PlasmaLayer  offset={game.offset}/>
            <RemovedLayer  offset={game.offset}/>
        {/if}
    </div>
    <div class="score">
        <Score/>
    </div>
    <EndLevel/>
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: minmax(300px, 1fr) 708px minmax(300px, 1fr);
        grid-template-rows: minmax(708px, 1fr);
        grid-template-areas: 'ghosts board score';
        align-items: center;

        .ghosts {
            grid-area: ghosts;
        }

        .board {
            grid-area: board;
        }

        .score {
            grid-area: score;
        }
    }
</style>