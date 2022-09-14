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

    const toggleModal = () => {
        isModalOpen = !isModalOpen
    }

    const newFolder = ({ data }) => {
        data.set('path', path)

        return ({ result }) => {
            if (result.type === 'success') {
                invalidateAll()
                Toast.fire({
                    title: 'Zložka úspešne vytvorená',
                    icon: 'success'
                })
            } else {
                Toast.fire({
                    title: 'Zložka nebola vytvorená',
                    icon: 'error'
                })
            }
        }
    }

</script>

<Button on:click={toggleModal} color="primary" outline class="border-0 my-2">
    <Icon name="folder-plus" class="h3"/>
</Button>

<Modal body isOpen={isModalOpen} toggle={toggleModal} header="Nová zložka">
    <form id="newFolderForm" method="POST" action="?/newFolder" use:enhance={newFolder}>
        <Input name="folderName" type="text" required/>
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
