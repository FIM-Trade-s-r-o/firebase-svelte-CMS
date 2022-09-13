<script lang="ts">
    import { Button, Col, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'sveltestrap'
    import PropertyInput from '$lib/components/PropertyInput.svelte'
    import type Schema from '$lib/schemas/lib'
    import { Toast } from '$lib/utils/alert'
    import { invalidateAll } from '$app/navigation'
    import { enhance } from '$app/forms'

    export let collectionName: string
    export let schema: Schema
    export let isOpen = false
    const data = {}

    const toggle = () => {
        isOpen = !isOpen
    }
    const createDocument = ({ data, cancel }) => {
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
        data.set('collectionName', collectionName)

        return async ({ result }) => {
            if (result.type === 'invalid') {
                await Toast.fire({
                    icon: 'error',
                    title: 'Chyba',
                    text: result.type.error
                })
                throw result.type.error
            } else {
                isOpen = false
                await invalidateAll() // TODO: check if works
                await Toast.fire({
                    icon: 'success',
                    title: 'Dokument úspešne vytvorený',
                    text: `ID dokumentu: ${result.data.id}`
                })
            }
        }
    }

</script>

<Modal {isOpen} {toggle} fullscreen>
    <ModalHeader {toggle}>
        Nový dokument
    </ModalHeader>
    <ModalBody>
        <form id="modal-form-{data.id}" method="POST" action="?/createDocument" use:enhance={createDocument}>
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
        <Button color="success" type="submit" form="modal-form-{data.id}">
            <Icon name="check2-all"/>
        </Button>
    </ModalFooter>
</Modal>
