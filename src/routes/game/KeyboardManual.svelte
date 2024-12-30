<script lang="ts">
    import up from '$lib/assets/up.png';
    import down from '$lib/assets/down.png';
    import left from '$lib/assets/left.png';
    import right from '$lib/assets/right.png';

    interface Key {
        name: string;
        image: string;
        description: string;
    }

    const keys: Record<string, Key> = {
        up: {
            name: 'Arrow up',
            image:
            up,
            description:
                'Rotate flying bullet',
        }
        ,
        down: {
            name: 'Arrow down',
            image:
            down,
            description:
                'Move bullet one cell down'
        }
        ,
        left: {
            name: 'Arrow left',
            image:
            left,
            description:
                'Move bullet one cell left'
        }
        ,
        right: {
            name: 'Arrow right',
            image:
            right,
            description:
                'Move bullet one cell right'
        }
    }
</script>

{#snippet renderKey(key: Key)}
    <li class="flex items-center gap-x-2" title={`${key.name} - ${key.description}`}>
        <img class="inline" src={key.image} alt={key.name}/>
        <span>{key.description}</span>
    </li>
{/snippet}

<div class="w-full">
    <ul class=" w-full space-y-4">
        {#each Object.values(keys) as key}
            {@render renderKey(key)}
        {/each}
    </ul>
</div>