<script lang="ts">
    import PropertyInput from '$lib/components/PropertyInput.svelte'
    import { Button, Col, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'sveltestrap'
    import type Schema from '$lib/schemas/lib'
    import { Toast } from '$lib/utils/alert'
    import { enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'

    export let collection: string
    export let schema: Schema
    export let document: object

    let isModalOpen = false
    const toggleModal = () => {
        isModalOpen = !isModalOpen
    }
    const updateData = ({ data, cancel }) => {
        const retrievedFormData = {}
        schema.forEach(({ property, type }) => {
            retrievedFormData[property] = type.type(data.get(property))
        })
        if (!schema.validate(retrievedFormData)) {
            cancel()
            Toast.fire({
                icon: 'error',
                title: 'Dáta dokumentu nezdpovedajú schéme'
            })
        }

        data.set('collectionName', collection)
        data.set('documentId', document.id)

        return async ({ result }) => {
            if (result.type === 'success') {
                toggleModal()
                await invalidateAll()
                Toast.fire({
                    title: 'Dokument upravený',
                    icon: 'success'
                })
            }
        }
    }
    const deleteDocument = ({ data }) => {
        data.set('collectionName', collection)
        data.set('documentId', document.id)

        return async ({ result }) => {
            if (result.type === 'success') {
                toggleModal()
                await invalidateAll()
                Toast.fire({
                    title: 'Dokument vymazaný',
                    icon: 'success'
                })
            } else {
                Toast.fire({
                    title: 'Chyba pri vymazaní dokumentu',
                    icon: 'error'
                })
            }
        }
    }

</script>

<Row>
    <Col>
        <Button on:click={toggleModal} color="transparent" class="m-0 p-0 w-100">
            <Row class="border-bottom">
                {#each schema.properties as property}
                    <Col style="max-height: 10rem; overflow: auto;">
                        {document[property]}
                    </Col>
                {/each}
            </Row>
        </Button>
    </Col>
</Row>

<Modal isOpen={isModalOpen} toggle={toggleModal} fullscreen>
    <ModalHeader toggle={toggleModal}>
        {document.id}
    </ModalHeader>
    <ModalBody>
        <form id="modal-form-{document.id}" method="POST" action="?/updateDocument" use:enhance={updateData}>
            {#each schema.properties as property}
                <Row class="border-bottom">
                    <Col>
                        <h4>
                            {property}:
                        </h4>
                        <PropertyInput bind:value={document[property]} {schema} {property}/>
                    </Col>
                </Row>
            {/each}
        </form>
    </ModalBody>
    <ModalFooter>
        <form method="POST" action="?/deleteDocument" use:enhance={deleteDocument}>
            <Button type="submit" color="danger" class="me-auto">
                <Icon name="trash"/>
            </Button>
        </form>
        <Button color="secondary">
            Zrušiť
        </Button>
        <Button type="submit" form="modal-form-{document.id}" color="success">
            <Icon name="check2-all"/>
        </Button>
    </ModalFooter>
</Modal>
