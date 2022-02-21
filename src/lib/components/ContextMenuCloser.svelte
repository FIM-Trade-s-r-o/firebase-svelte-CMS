<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    const close = () => {
      dispatch('close');
    }
</script>

<svelte:body on:click={close} on:contextmenu|preventDefault={close}/>
