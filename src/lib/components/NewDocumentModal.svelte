<script lang="ts">
    import { Button, Col, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'sveltestrap'
    import { collection, addDoc } from 'firebase/firestore'
    import PropertyInput from '$lib/components/PropertyInput.svelte'
    import type Schema from '$lib/schemas/lib'
    import { firestore } from '$lib/firebase'
    import { Toast } from '$lib/utils/alert'
    import { createEventDispatcher } from 'svelte'

    export let collectionName: string
    export let schema: Schema
    export let isOpen = false
    const collectionRef = collection(firestore, collectionName)
    const dispatch = createEventDispatcher()
    const data = {}

    const toggle = () => {
        isOpen = !isOpen
    }
    const submit = async () => {
        try {
            if (schema.validate(data)) {
                const docRef = await addDoc(collectionRef, data)
                isOpen = false
                dispatch('addedDocument')
                await Toast.fire({
                    icon: 'success',
                    title: 'Dokument úspešne vytvorený',
                    text: `ID dokumentu: ${docRef.id}`
                })
            } else {
                await Toast.fire({
                    icon: 'error',
                    title: 'Dáta dokumentu nezdpovedajú schéme'
                })
            }
        } catch (error) {
            await Toast.fire({
                icon: 'error',
                title: 'Chyba',
                text: error
            })
            throw error
        }
    }

</script>

<Modal {isOpen} {toggle} fullscreen>
    <ModalHeader {toggle}>
        Nový dokument
    </ModalHeader>
    <ModalBody>
        <form id="modal-form-{data.id}" on:submit|preventDefault={submit}>
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
