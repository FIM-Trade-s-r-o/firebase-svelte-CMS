<script context="module">
    import { firestore } from "$lib/firebase/index";
    import { collection, getDocs } from 'firebase/firestore';

    export async function load({ params }) {
        console.log(params)
        const collectionName = params.collection;

        const docsSnap = await getDocs(collection(firestore, collectionName));

        let collectionData = [];
        await docsSnap.forEach(document => {
            console.log(document)
            collectionData = [
                ...collectionData,
                {
                    id: document.id,
                    ...document.data()
                }
            ]
        })
        return {
            props: {
                collectionData,
                collectionName
            }
        };
    }
</script>
<script>
    import {
        Row,
        Col,
        Button,
        Icon
    } from "sveltestrap";
    import Document from "$lib/components/Document.svelte";
    import EmptyCollection from "$lib/components/EmptyCollection.svelte";
    import config from "$lib/config";

    export let collectionData;
    export let collectionName;
    const schema = config.getCollectionSchema(collectionName);
</script>

<Row class="justify-content-end bg-dark">
    <Col class="text-white">
        <h4 class="my-3">
            {collectionName}
        </h4>
    </Col>
    <Col xs="auto">
        <Button href="/dashboard" color="transparent" class="m-2">
            <Icon name="arrow-left" class="h4 text-warning"/>
        </Button>
    </Col>
</Row>
<Row>
    <Col xs="12">
        {#await collectionData}
            nacitavanie
        {:then collection}
            {#each collection as document}
                <Document collection={collectionName} {schema} data={document}/>
            {:else}
                <EmptyCollection />
            {/each}
        {/await}
    </Col>
</Row>
