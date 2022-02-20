<script lang="ts">
    import File from "$lib/components/File.svelte";

    export let items: Array<string> = [];
</script>

{#each items as item}
    <File value={item}/>
{/each}
