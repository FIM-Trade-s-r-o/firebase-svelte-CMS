<script context="module" lang="ts">
    import { firestore } from "$lib/firebase";
    import { collection, getDocs } from 'firebase/firestore';

	const getCollection = async (collectionName) => {
		const docsSnap = await getDocs(collection(firestore, collectionName));
		
		let collectionData = [];
		await docsSnap.forEach(document => {
			//console.log(document)
			collectionData = [
				...collectionData,
				{
					id: document.id,
					...document.data()
				}
			]
		})
		return collectionData;
	}
    export async function load({ page }) {
	    const collectionName = page.params.collection;
	
	    return {
            props: {
                collectionData: getCollection(collectionName),
                collectionName
            }
        };
    }
</script>
<script lang="ts">
    import {
        Row,
        Col,
        Button,
        Icon, Spinner
    } from "sveltestrap";
    import Document from "$lib/components/Document.svelte";
    import EmptyCollection from "$lib/components/EmptyCollection.svelte";
    import config from "$lib/config";
    import NewDocumentModal from "$lib/components/NewDocumentModal.svelte";
    import CollectionHeader from "$lib/components/CollectionHeader.svelte";

    export let collectionData: object;
    export let collectionName: string;
    const schema = config.getCollectionSchema(collectionName);
    let isNewDocumentModalOpen = false;
    const openNewDocumentModal = () => {
      isNewDocumentModalOpen = true;
    }

</script>

<Row class="justify-content-end align-items-center bg-dark">
    <Col class="text-white">
        <h4 class="my-3">
            {collectionName}
        </h4>
    </Col>
    <Col xs="auto">
        <Button on:click={openNewDocumentModal} color="primary" outline class="border-0 m-2">
            <Icon name="plus" class="h3"/>
        </Button>
    </Col>
    <Col xs="auto">
        <Button href="/dashboard/collections" color="warning" outline class="border-0 m-2">
            <Icon name="arrow-left" class="h4"/>
        </Button>
    </Col>
</Row>
<Row class="flex-grow-1">
    <Col xs="12">
        {#await collectionData}
	        <Row class="h-100 justify-content-center align-items-center">
		        <Col xs="auto">
			        <Spinner type="grow"/>
		        </Col>
	        </Row>
        {:then collection}
            <CollectionHeader {schema}/>
            {#each collection as document}
                <Document collection={collectionName} {schema} data={document}/>
            {:else}
                <EmptyCollection />
            {/each}
            <NewDocumentModal {collectionName} {schema} bind:isOpen={isNewDocumentModalOpen}/>
        {/await}
    </Col>
</Row>
