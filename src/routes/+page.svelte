<script lang="ts">
    const rows = $state(Array.from(Array(16).keys()).map(() => Array.from(Array(8).keys()).map(() => '')));
    let selectedRowIndex = $state(0);
    let selectedCellIndex = $state(4);
    let position: 'vertical' | 'horizontal' = $state("horizontal");
    let initialTop = 4;
    let offset = 36;
    let rotation = $state(0);
    let topCorrection = $state(0)
    let topPosition = $derived(initialTop + (offset * selectedRowIndex) - topCorrection);
    let left = $state(108);

    rows[13][4] = 'virus virus_yellow';
    rows[7][6] = 'virus virus_pink';
    rows[9][2] = 'virus virus_blue';

    setInterval(() => {
        selectedRowIndex += 1;
        if (selectedRowIndex === rows.length - 1) {
            selectedRowIndex = 0;
        }
    }, 1000)

    const rotationHandler: Record<number, () => void> = {
        0: () => {
            rotation = 270;
            left -= (offset / 2 );
            topCorrection = offset / 2;
        },
        270: () => {
            rotation = 180;
            left -= ( offset / 2 );
            topCorrection = 0;
        },
        180: () => {
            rotation = 90;
            left += (offset / 2 );
            topCorrection = -(offset / 2);
        },
        90: () => {
            rotation = 0;
            left += ( offset / 2 );
            topCorrection = 0;
        }
    }

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
            rotationHandler[rotation]();

            if (position === 'horizontal') {
                position = 'vertical';
            } else {
                position = 'horizontal'
            }
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown}></svelte:window>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div class="container">
    <div
            style:top={`${topPosition}px`}
            style:left={`${left}px`}
            style:transform="{`rotate(${rotation}deg`}"
            class="pill">
        <div class="pill-part-pink"></div>
        <div class="pill-part-break"></div>
        <div class="pill-part-yellow"></div>
    </div>
    <div class="board">
        {#each rows as row, rowIndex}
            <div class="row">
                {#each row as cell, cellIndex}
                    <div class={`cell ${cell}`}></div>
                {/each}
            </div>
        {/each}
    </div>

</div>

<style>
    .container {
        margin-top: 30px;
    }
    .board {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        gap: 4px;
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
        position: relative;
        z-index: 10;

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
