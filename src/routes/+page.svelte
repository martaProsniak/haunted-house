<script lang="ts">
    const rows = $state(Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => '')));
    let selectedRowIndex = $state(0);
    let selectedCellIndex = $state(4);
    let position: 'vertical' | 'horizontal' = $state("horizontal");
    let initialTop = 78;
    let offset = 36;
    let rotation = $state(0);
    let topCorrection = $state(0)
    let topPosition = $derived(initialTop + (offset * selectedRowIndex) - topCorrection);
    let left = $state(116);

    rows[13][4] = 'virus virus_yellow';
    rows[7][6] = 'virus virus_pink';
    rows[9][2] = 'virus virus_blue';

    setInterval(() => {
        selectedRowIndex += 1;
        if (selectedRowIndex === rows.length - 1) {
            selectedRowIndex = 0;
        }
    }, 1000)

    const handleKeyDown = (ev: KeyboardEvent) => {
        console.log(ev)
        if (ev.key === 'ArrowLeft') {
            left -= offset;
        }

        if (ev.key === 'ArrowRight') {
            left += offset;
        }

        if (ev.key === 'ArrowDown') {
            if (selectedRowIndex > 0) {
                selectedRowIndex += 1;
            }
        }

        if (ev.key === 'ArrowUp') {
            if (rotation === 0) {
                rotation = 270;
            } else {
                rotation -= 90;
            }
            if (position === 'horizontal') {
                position = 'vertical';
                left -= (offset / 2 );
                topCorrection = offset / 2;
            } else {
                position = 'horizontal'
                left += (offset / 2 );
                topCorrection = 0;
            }
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown}></svelte:window>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div class="board">
    {#each rows as row, rowIndex}
        <div class="row">
            {#each row as cell, cellIndex}
                <div class={`cell ${cell}`}></div>
            {/each}
        </div>
    {/each}
</div>
<div style:top={`${topPosition}px`} style:left={`${left}px`} style:transform="{`rotate(${rotation}deg`}" class="pill"><div class="pill-part-pink"></div><div class="pill-part-break"></div><div class="pill-part-yellow"></div></div>

<style>
    .board {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        gap: 4px;
        background-color: cornflowerblue;
        width: fit-content;
        padding: 4px;
    }
    .row {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        width: fit-content;
        gap: 4px;
        justify-content: center;
        align-items: center;
        background-color: darkslateblue;

        .cell {
            width: 32px;
            height: 32px;
            transition: background-color 0.25s ease;
            background-color: lightpink;
            border: none;

            &.virus {
                box-sizing: border-box;
                border: 2px solid black;
                border-radius: 50%;
            }

            &.virus_yellow {
                background-color: yellow;
                content: "v"
            }

            &.virus_blue {
                background-color: dodgerblue;
                content: "v"
            }

            &.virus_pink {
                background-color: hotpink;
                content: "v"
            }
        }
    }

    .pill {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        border-radius: 16px;
        border: 4px black solid;
        width: 68px;
        height: 32px;
        position: absolute;
        left: 98px;

        .pill-part-pink {
            background-color: hotpink;
            width: 32px;
        }

        .pill-part-break {
            background-color: black;
            width: 4px;
        }

        .pill-part-yellow {
            background-color: yellow;
            width: 32px;
        }
    }
</style>
