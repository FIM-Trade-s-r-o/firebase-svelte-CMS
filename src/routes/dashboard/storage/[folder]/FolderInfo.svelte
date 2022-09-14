<script lang="ts">
    import {
        Button,
        Icon,
        Modal
    } from 'sveltestrap'

    export let files
    export let folders

    let infoVisible = false

    const toggleInfo = () => {
        infoVisible = !infoVisible
    }
</script>

<Button on:click={toggleInfo} color="primary" outline class="border-0 my-2">
    <Icon name="info-circle" class="h3"/>
</Button>

<Modal body isOpen={infoVisible} toggle={toggleInfo}>
    <p>
        Počet súborov: {files.length}
    </p>
    <p>
        Počet adresárov: {folders.length}
    </p>
</Modal>
