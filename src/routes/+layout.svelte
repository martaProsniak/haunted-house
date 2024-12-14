<script>
    import './../app.css'

    const {children} = $props();
</script>

<div class="text-violet-100 min-h-screen h-full font-nunito">
    {@render children()}
</div>
