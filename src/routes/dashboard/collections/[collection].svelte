<script context="module" lang="ts">
    import { firestore } from "$lib/firebase";
    import { collection, getDocs, query, orderBy } from 'firebase/firestore';
    import config from "$lib/config";

	const getCollection = async (collectionName) => {
        const sorting = config.getCollection(collectionName).sortBy;
        let docsSnap;
        if (sorting) {
            docsSnap = await getDocs(query(collection(firestore, collectionName), orderBy(sorting.property, sorting.sort)));
        } else {
            docsSnap = await getDocs(collection(firestore, collectionName));
        }

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
    export async function load({ params }) {
	    const collectionName = params.collection;
	
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
    import NewDocumentModal from "$lib/components/NewDocumentModal.svelte";
    import CollectionHeader from "$lib/components/CollectionHeader.svelte";

    export let collectionData: object;
    export let collectionName: string;
    const schema = config.getCollection(collectionName).schema;
    let isNewDocumentModalOpen = false;
    const openNewDocumentModal = () => {
      isNewDocumentModalOpen = true;
    }
    const reload = () => {
        collectionData = getCollection(collectionName);
    };

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
                <Document collection={collectionName} {schema} data={document} on:deletedDocument={reload}/>
            {:else}
                <EmptyCollection />
            {/each}
            <NewDocumentModal {collectionName} {schema} bind:isOpen={isNewDocumentModalOpen} on:addedDocument={reload}/>
        {/await}
    </Col>
</Row>
