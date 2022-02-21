<script lang="ts">
    import {
        Col,
        Card,
        CardBody,
        CardFooter,
        Icon
    } from "sveltestrap";
    import ContextMenu from "$lib/components/ContextMenu.svelte";

    export let value;
    let contextMenuOpener: boolean;

    const openContextMenu = (event) => {
        contextMenuOpener = event;
    }

    $: name = value.name;
</script>

<Col xs="12" sm="6" md="4" lg="3" xl="2" class="h-auto">
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

<ContextMenu bind:opener={contextMenuOpener}/>