<script lang="ts">
    import { getDownloadURL, deleteObject } from 'firebase/storage';
    import { createEventDispatcher } from "svelte";
    import { Toast } from "$lib/utils/alert";
    import {
        Col,
        Card,
        CardBody,
        CardFooter,
        Icon,
        ListGroupItem
    } from "sveltestrap";
    import ContextMenu from "$lib/components/ContextMenu.svelte";

    export let value;
    const dispatch = createEventDispatcher();
    let name;
    let contextMenuOpener: boolean;

    const openContextMenu = (event) => {
        contextMenuOpener = event;
    }
    const deleteFile = async () => {
        await deleteObject(value);
        dispatch('delete');
        await Toast.fire({
            title: 'Súbor úspešne vymazaný',
            icon: 'success'
        })
    }
    const copyLink = async () => {
        const url = await getDownloadURL(value);
        await navigator.clipboard.writeText(url);
        await Toast.fire({
            title: 'Link skopírovaný',
            icon: 'success',
            timer: 750
        })
    }

    $: name = value.name;
</script>

<Col xs="12" sm="6" md="4" lg="3" xl="2" class="h-auto mb-4">
    <div on:contextmenu|preventDefault|stopPropagation={openContextMenu} class="w-100 h-100">
        <Card class="w-100 h-100">
            <CardBody class="d-flex justify-content-center">
                <Icon name="file-earmark" class="display-3"/>
            </CardBody>
            <CardFooter class="bg-white">
                <p class="m-0 text">
                    {name}
                </p>
            </CardFooter>
        </Card>
    </div>
</Col>

<ContextMenu bind:opener={contextMenuOpener}>
    <ListGroupItem tag="button" on:click={copyLink}>
        <Icon name="clipboard"/> Skopírovať link
    </ListGroupItem>
    <ListGroupItem tag="button" on:click={deleteFile}>
        <Icon name="trash"/> Vymazať súbor
    </ListGroupItem>
</ContextMenu>