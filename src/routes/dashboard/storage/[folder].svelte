<script lang="ts" context="module">
    import { ref, listAll } from "firebase/storage";
    import { storage } from "$lib/firebase";

    export async function load({ page }) {
        const path = (page.params.folder).replaceAll('|', '/');
        const reference = ref(storage, path === 'root' ? '/' : path);

        const response = await listAll(reference);

        let folders = [];
        let files = [];

        response.prefixes.forEach((folderRef) => {
            folders = [
                ...folders,
                folderRef
            ]
        });
        response.items.forEach((itemRef) => {
            console.log(itemRef.name)
            if (itemRef.name !== '.ghostfile') {
                files = [
                    ...files,
                    itemRef
                ]
            }
        });

        return {
            props: {
                reference,
                path,
                folders,
                files
            }
        };
    }
</script>
<script lang="ts">
    import Sweetalert from "sweetalert2";
    import { uploadString, uploadBytes } from 'firebase/storage';
    import {
        Row,
        Col,
        Button,
        Icon
    } from "sveltestrap";
    import FoldersList from "$lib/components/FoldersList.svelte";
    import FilesList from "$lib/components/FilesList.svelte";
    import {Toast} from "$lib/utils/alert";

    export let reference;
    export let path;
    export let folders;
    export let files;

    const newFolder = async () => {
        // const dir = ref
        const { value: folderName } = await Sweetalert.fire({
            title: 'Názov novej zložky',
            input: 'text',
            showCloseButton: true,
            buttonsStyling: false,
            confirmButtonText: 'Potvrdiť',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Názov zložky nemôže byť prázdny'
                }
            }
        })

        if (folderName) {
            const directory = ref(reference, folderName)
            const ghostFile = ref(directory, '.ghostfile')
            await uploadString(ghostFile, '')
            await Toast.fire({
                title: 'Zložka úspešne vytvorená',
                icon: 'success'
            })
            await refreshItems();
        }
    }
    const newFile = async () => {
        const { value: file } = await Sweetalert.fire({
            title: 'Nahrať súbor',
            input: 'file',
            inputAttributes: {
                'aria-label': 'Súbor'
            }
        })

        if (file) {
            const uploadRef = ref(reference, file.name);
            await uploadBytes(uploadRef, file);
            await refreshItems();
            await Toast.fire({
                title: 'Súbor úspešne nahraný',
                icon: 'success'
            })
        }
    }
    const refreshItems = async () => {
        const reference = ref(storage, path === 'root' ? '/' : path);
        const response = await listAll(reference);

        folders = [];
        files = [];
        response.prefixes.forEach((folderRef) => {
            folders = [
                ...folders,
                folderRef
            ]
        });
        response.items.forEach((itemRef) => {
            if (itemRef.name !== '.ghostfile') {
                files = [
                    ...files,
                    itemRef
                ]
            }
        });
    }
</script>

<div class="h-100 d-flex flex-column">
    <Row class="justify-content-end align-items-center bg-dark">
        <Col class="text-white">
            <h4 class="my-3">
                {path}
            </h4>
        </Col>
        <Col xs="auto">
            <Button on:click={newFolder} color="primary" outline class="border-0 my-2">
                <Icon name="folder-plus" class="h3"/>
            </Button>
            <Button on:click={newFile} color="primary" outline class="border-0 my-2">
                <Icon name="file-earmark-plus" class="h3"/>
            </Button>
        </Col>
        <Col xs="auto">
            <Button href="/dashboard" color="warning" outline class="border-0 m-2">
                <Icon name="arrow-left" class="h4"/>
            </Button>
        </Col>
    </Row>
    <Row class="flex-grow-1 pt-3">
        {#if folders.length === 0 && files.length === 0}
            <Col xs="12" class="d-flex justify-content-center align-items-center text-center">
                <h1 class="text-muted">
                    Zložka je prázdna
                </h1>
            </Col>
        {/if}
        <Col>
            <Row>
                <FoldersList items={folders}/>
                <FilesList items={files} on:refreshRequest={refreshItems}/>
            </Row>
        </Col>
    </Row>
</div>
