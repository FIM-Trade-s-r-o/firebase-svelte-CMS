<script lang="ts" context="module">
    import { ref, listAll } from "firebase/storage";
    import { storage } from "$lib/firebase";

    export async function load({ params }) {
        const path = (params.folder).replaceAll('|', '/');
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
    import {uploadString, uploadBytes, deleteObject} from 'firebase/storage';
    import { goto } from "$app/navigation";
    import { Toast } from "$lib/utils/alert";
    import {
        Row,
        Col,
        Button,
        Icon,
        Breadcrumb,
        BreadcrumbItem
    } from "sveltestrap";
    import FoldersList from "$lib/components/FoldersList.svelte";
    import FilesList from "$lib/components/FilesList.svelte";

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
            await refreshItems();
            await Toast.fire({
                title: 'Zložka úspešne vytvorená',
                icon: 'success'
            })
        }
    }
    const uploadFile = async (file) => {
        const uploadRef = ref(reference, file.name);
        await uploadBytes(uploadRef, file);
    }
    const newFile = async () => {
        const { value: files } = await Sweetalert.fire({
            title: 'Nahrať súbor',
            input: 'file',
            inputAttributes: {
                'aria-label': 'Súbor',
                'multiple': 'true'
            }
        })

        if (files.length > 0) {
            console.log(files)
            let uploads = [];
            for (const file of files) {
                uploads = [
                    ...uploads,
                    uploadFile(file)
                ]
            }
            await Promise.all(uploads);
            await refreshItems();
            await Toast.fire({
                title: `Súbor${files.length === 1 ? '' : 'y'} úspešne nahran${files.length === 1 ? 'ý' : 'é'}`,
                icon: 'success'
            })
        }
    }
    const deleteThisFolder = async () => {
        const ghostfileRef = ref(reference, '.ghostfile');
        await deleteObject(ghostfileRef);
        await goBack();
        await Toast.fire({
            title: 'Zložka úspešne vymazaná',
            icon: 'success',
            timer: 750
        });
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
    const goBack = () => {
        if (path === 'root') {
            goto('/dashboard');
        } else {
            if (path.includes('/')) {
                const newPath = path.slice(0, path.lastIndexOf('/'))
                goto(`/dashboard/storage/${newPath.replaceAll('/','|')}`)
                console.log(newPath)
            } else {
                goto(`/dashboard/storage/root`)
            }
        }
    }
</script>

<div class="h-100 d-flex flex-column">
    <Row class="justify-content-end align-items-center bg-dark">
        <Col>
            <Breadcrumb class="my-2 text-white h3">
                <BreadcrumbItem>
                    /
                </BreadcrumbItem>
                {#each path.split('/') as directory}
                    {#if directory !== 'root'}
                        <BreadcrumbItem>
                            {directory}
                        </BreadcrumbItem>
                    {/if}
                {:else}
                    /
                {/each}
            </Breadcrumb>
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
            <Button on:click={goBack} color="warning" outline class="border-0 m-2">
                <Icon name={path === 'root' ? 'arrow-left' : 'arrow-up'} class="h4"/>
            </Button>
        </Col>
    </Row>
    <Row class="flex-grow-1 pt-3">
        {#if folders.length === 0 && files.length === 0}
            <Col xs="12" class="d-flex justify-content-center align-items-center text-center">
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <h1 class="text-muted">
                                    Zložka je prázdna
                                </h1>
                            </Col>
                        </Row>
                        {#if path !== 'root'}
                            <Row>
                                <Col>
                                    <Button on:click={deleteThisFolder} color="danger" outline class="border-0 p-0">
                                        <Icon name="trash" class="display-4"/>
                                    </Button>
                                </Col>
                            </Row>
                        {/if}
                    </Col>
                </Row>
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
