<script lang="ts">
    import type Schema from '$lib/schemas/lib'
    import { Button, Col, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'sveltestrap'
    import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
    import PropertyInput from '$lib/components/PropertyInput.svelte'
    import { firestore } from '$lib/firebase'
    import { Toast } from '$lib/utils/alert'
    import { createEventDispatcher } from 'svelte'

    export let collection: string
    export let schema: Schema
    export let data: object
    const documentRef = doc(firestore, collection, data.id)
    const dispatch = createEventDispatcher()

    let isModalOpen = false
    const toggleModal = () => {
        isModalOpen = !isModalOpen
    }
    const updateData = async () => {
        if (schema.validate(data)) {
            await updateDoc(documentRef, data)
            toggleModal()
            await Toast.fire({
                title: 'Dokument upravený',
                icon: 'success'
            })
        } else {
            await Toast.fire({
                icon: 'error',
                title: 'Dáta dokumentu nezdpovedajú schéme'
            })
        }
    }
    const deleteDocument = async () => {
        await deleteDoc(documentRef)
        toggleModal()
        dispatch('deletedDocument')
        await Toast.fire({
            title: 'Dokument vymazaný',
            icon: 'success'
        })
    }

</script>

<Row>
    <Col>
        <Button on:click={toggleModal} color="transparent" class="m-0 p-0 w-100">
            <Row class="border-bottom">
                {#each schema.properties as property}
                    <Col style="max-height: 10rem; overflow: auto;">
                        {data[property]}
                    </Col>
                {/each}
            </Row>
        </Button>
    </Col>
</Row>

<Modal isOpen={isModalOpen} toggle={toggleModal} fullscreen>
    <ModalHeader toggle={toggleModal}>
        {data.id}
    </ModalHeader>
    <ModalBody>
        <form id="modal-form-{data.id}" on:submit|preventDefault={updateData}>
            {#each schema.properties as property}
                <Row class="border-bottom">
                    <Col>
                        <h4>
                            {property}:
                        </h4>
                        <PropertyInput bind:value={data[property]} {schema} {property}/>
                    </Col>
                </Row>
            {/each}
        </form>
    </ModalBody>
    <ModalFooter>
        <Button on:click={deleteDocument} color="danger" class="me-auto">
            <Icon name="trash"/>
        </Button>
        <Button color="secondary">
            Zrušiť
        </Button>
        <Button color="success" type="submit" form="modal-form-{data.id}">
            <Icon name="check2-all"/>
        </Button>
    </ModalFooter>
</Modal>