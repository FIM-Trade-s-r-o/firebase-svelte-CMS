<script lang="ts">
    import {
        Button,
        Icon, Input,
        Modal, ModalFooter
    } from 'sveltestrap'
    import { enhance } from '$app/forms'
    import { Toast } from '$lib/utils/alert'
    import { invalidateAll } from '$app/navigation'

    export let path

    let isModalOpen = false
    let uploading = false

    const toggleModal = () => {
        isModalOpen = !isModalOpen
    }

    const newFile = ({ data }) => {
        data.set('path', path)

        uploading = true

        return ({ result }) => {
            uploading = false
            if (result.type === 'success') {
                const filesCount = result.data.filesCount
                invalidateAll()
                toggleModal()
                Toast.fire({
                    title: `Súbor${filesCount === 1 ? '' : 'y'} úspešne nahran${filesCount === 1 ? 'ý' : 'é'}`,
                    icon: 'success'
                })
            }
        }
    }
</script>

<Button on:click={toggleModal} color="primary" outline class="border-0 my-2">
    <Icon name="file-earmark-plus" class="h3"/>
</Button>

<Modal body isOpen={isModalOpen} toggle={toggleModal} header="Nahrať súbor/y">
    <form id="newFileForm" method="POST" action="?/newFile" use:enhance={newFile}>
        <Input name="files[]" type="file" multiple required/>
    </form>
    <ModalFooter>
        {#if uploading}
            Dáta sa nahrávajú
        {:else}
            <Button on:click={toggleModal} color="secondary" class="border-0 my-2">
                Zrušiť
            </Button>
            <Button form="newFileForm" type="submit" color="primary" class="border-0 my-2">
                Potvrdiť
            </Button>
        {/if}
    </ModalFooter>
</Modal>
