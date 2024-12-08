<script>
    import './../app.css'

    const {children} = $props();
</script>

<div class="bg-stone-900 text-stone-100 min-h-screen">
    {@render children()}
</div>
