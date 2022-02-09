<script lang="ts">
    import {Button, Col, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "sveltestrap";
    import { collection, addDoc } from "firebase/firestore";
    import PropertyInput from "$lib/components/PropertyInput.svelte";
    import type Schema from "$lib/schemas/lib";
    import {firestore} from "$lib/firebase";

    export let collectionName: string;
    export let schema: Schema;
    export let isOpen = false;
    const collectionRef = collection(firestore, collectionName);
    let data = {};

    const toggle = () => {
        isOpen = !isOpen;
    }
    const submit = async () => {
        const docRef = await addDoc(collectionRef, data);
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
