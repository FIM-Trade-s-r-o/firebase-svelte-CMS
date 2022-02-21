<script lang="ts">
    import {
        ListGroup,
        Portal
    } from "sveltestrap";

    export let opener = null;
    let isOpen = false;
    let style: string;
    let screenWidth: number;
    let menuWidth: number;

    const open = (event) => {
        if (event) {
            isOpen = true;
            if (event.x + menuWidth > screenWidth) {
                style = `right: ${0}; top: ${event.y}px`
            } else {
                style = `left: ${event.x}px; top: ${event.y}px`
            }
        }
    }
    const close = () => {
        isOpen = false;
    }

    $: open(opener);
</script>

<svelte:window bind:innerWidth={screenWidth}/>
<svelte:body on:click={close} on:contextmenu|preventDefault={close}/>

{#if isOpen}
    <Portal>
        <div bind:clientWidth={menuWidth} class="position-absolute w-auto" {style}>
            <ListGroup class="text-nowrap">
                <slot/>
            </ListGroup>
        </div>
    </Portal>
{/if}
