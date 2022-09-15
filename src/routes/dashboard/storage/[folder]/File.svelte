<script lang="ts">
    import { Toast } from '$lib/utils/alert'
    import {
        Col,
        Card,
        CardBody,
        CardFooter,
        Icon,
        ListGroupItem
    } from 'sveltestrap'
    import ContextMenu from '$lib/components/ContextMenu.svelte'
    import { invalidateAll } from '$app/navigation'
    import { enhance } from '$app/forms'

    export let path
    export let name: string
    export let url: string
    let contextMenuOpener: boolean
    let deleteForm

    const openContextMenu = (event) => {
        contextMenuOpener = event
    }
    const deleteFile = async () => {
        const formData = new FormData(deleteForm)
        const deleteRequest = await fetch('?/deleteFile', {
            method: 'POST',
            body: formData
        })
        const response = await deleteRequest.json()
        console.log(response)
        invalidateAll()
        await Toast.fire({
            title: 'Súbor úspešne vymazaný',
            icon: 'success'
        })
    }
    const copyLink = async () => {
        await navigator.clipboard.writeText(url)
        await Toast.fire({
            title: 'Link skopírovaný',
            icon: 'success',
            timer: 750
        })
    }
</script>

<ContextMenu bind:opener={contextMenuOpener}>
    <ListGroupItem tag="button" on:click={copyLink}>
        <Icon name="clipboard"/> Skopírovať link
    </ListGroupItem>
    <ListGroupItem tag="button" on:click={deleteFile}>
        <Icon name="trash"/> Vymazať súbor
    </ListGroupItem>
</ContextMenu>

<Col xs="12" sm="6" md="4" lg="3" xl="2" class="h-auto mb-4">
    <a href={url} target="_blank" on:contextmenu|preventDefault|stopPropagation={openContextMenu}
       class="w-100 h-100 text-decoration-none text-body">
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
    </a>
</Col>

<form bind:this={deleteForm} id="delete-{name}" method="POST" action="?/deleteFile" use:enhance={deleteFile} hidden>
    <input name="path" value={path}>
    <input name="name" value={name}>
</form>
