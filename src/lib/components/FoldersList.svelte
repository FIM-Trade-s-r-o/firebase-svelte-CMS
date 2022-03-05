<script lang="ts">
    import Folder from "$lib/components/Folder.svelte";

    export let items: Array<string> = [];
</script>

{#each items as item}
    <Folder value={item}/>
{/each}