<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import File from "$lib/components/File.svelte";

    export let items: Array<string> = [];

    const dispatch = createEventDispatcher();

    const refreshRequest = () => {
        dispatch('refreshRequest');
    }
</script>

{#each items as item}
    <File value={item} on:delete={refreshRequest}/>
{/each}
