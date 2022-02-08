<script lang="ts">
    import type Schema from "$lib/schemas/lib";
    import {Button, Col, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "sveltestrap";
    import { doc, updateDoc } from "firebase/firestore";
    import PropertyInput from "$lib/components/PropertyInput.svelte";
    import {firestore} from "$lib/firebase";
    import {Toast} from "$lib/utils/alert";

    export let collection: string;
    export let schema: Schema;
    export let data: object;

    let isModalOpen = false;
    const toggleModal = () => {
        isModalOpen = !isModalOpen;
    }
    const updateData = async () => {
        const document = doc(firestore, collection, data.id);
        await updateDoc(document, data);
        toggleModal();
        await Toast.fire({
            title: 'Dokument upravený',
            icon: 'success'
        });
    }

</script>

<Button on:click={toggleModal} color="transparent" class="m-0 p-0">
    <Row class="border-bottom">
        {#each schema.properties as property}
            <Col>
                {data[property]}
            </Col>
        {/each}
    </Row>
</Button>

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
        <Button color="danger" class="me-auto">
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