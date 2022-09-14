<script lang="ts">
    import Folder from './Folder.svelte'

    export let items: Array<string> = []
    console.log(items)
</script>

{#each items as item}
    <Folder {...item}/>
{/each}
