<script lang="ts">
    import Folder from './Folder.svelte'

    export let items: Array<string> = []
</script>

{#each items as item}
    <Folder {...item}/>
{/each}
