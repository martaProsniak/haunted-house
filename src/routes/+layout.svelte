<script>
    import './../app.css'

    const {children} = $props();
</script>

<div class="text-violet-200 h-screen w-screen font-nunito flex items-center justify-center p-16">
    {@render children()}
</div>
