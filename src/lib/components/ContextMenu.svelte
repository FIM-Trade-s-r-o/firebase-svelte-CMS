<script>
    import {
        ListGroup,
        ListGroupItem,
        Portal
    } from "sveltestrap";
    import ContextMenuCloser from "$lib/components/ContextMenuCloser.svelte";

    export let opener = null;
    let isOpen = false;
    let x = 0;
    let y = 0;

    const open = (event) => {
        if (event) {
            console.log(event)
            x = event.x;
            y = event.y;
            isOpen = true;
        }
    }
    const close = () => {
        isOpen = false;
    }
    $: open(opener);
    $: console.log(isOpen)
</script>



{#if isOpen}
    <ContextMenuCloser on:close={close}/>
    <Portal>
        <ListGroup class="position-absolute" style="left: {x}px; top: {y}px">
            <ListGroupItem>
                Vymazať
            </ListGroupItem>
        </ListGroup>
    </Portal>
{/if}
