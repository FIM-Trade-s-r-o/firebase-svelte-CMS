<script lang="ts">
    import File from './File.svelte'

    export let path
    export let items: Array<string> = []
</script>

{#each items as item}
    <File {...item} {path}/>
{/each}
