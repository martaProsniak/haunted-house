<script>
    import './../app.css'

    const {children} = $props();
</script>

<div class="text-violet-200 h-screen w-screen font-nunito flex items-center justify-center py-16 max-h-screen overflow-hidden">
    {@render children()}
</div>
