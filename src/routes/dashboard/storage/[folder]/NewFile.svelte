<script lang="ts">
    import {
        Button,
        Icon, Input,
        Modal, ModalFooter
    } from 'sveltestrap'
    import { enhance } from '$app/forms'
    import { Toast } from '$lib/utils/alert'

    export let path

    let isModalOpen = false

    const toggleModal = () => {
        isModalOpen = !isModalOpen
    }

    const newFile = ({ data }) => {
        data.set('path', path)

        return ({ result }) => {
            if (result.type === 'success') {
                const filesCount = result.data.filesCount
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
    <form method="POST" action="?/newFile" use:enhance={newFile}>
        <Input name="folderName" type="file" multiple required/>
    </form>
    <ModalFooter>
        <Button on:click={toggleModal} color="secondary" class="border-0 my-2">
            Zrušiť
        </Button>
        <Button form="newFolderForm" type="submit" color="primary" class="border-0 my-2">
            Potvrdiť
        </Button>
    </ModalFooter>
</Modal>
