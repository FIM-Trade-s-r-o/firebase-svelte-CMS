<script lang="ts">
    import {
        Row,
        Col,
        Button,
        Icon,
        Breadcrumb,
        BreadcrumbItem
    } from 'sveltestrap'
    import FolderInfo from './FolderInfo.svelte'
    import NewFolder from './NewFolder.svelte'
    import NewFile from './NewFile.svelte'

    export let path
    export let files
    export let folders

    const getBackPath = (path) => {
        if (path === '/') {
            return '/dashboard'
        } else if (path.shift(1).includes('/')) {
            const newPath = path.slice(0, path.lastIndexOf('/'))
            return `/dashboard/storage/${newPath.replaceAll('/', '|')}`
        } else {
            return '/dashboard/storage/root'
        }
    }
    $: backPath = getBackPath(path)
</script>

<Row class="justify-content-end align-items-center bg-dark">
    <Col>
        <Breadcrumb class="my-2 text-white h3">
            <BreadcrumbItem>
                /
            </BreadcrumbItem>
            {#each path.split('/') as directory}
                {#if directory !== '/'}
                    <BreadcrumbItem>
                        {directory}
                    </BreadcrumbItem>
                {/if}
            {/each}
        </Breadcrumb>
    </Col>
    <Col xs="auto">
        <FolderInfo {files} {folders}/>
        <NewFolder {path}/>
        <NewFile {path}/>
    </Col>
    <Col xs="auto">
        <Button data-sveltekit-reload="" href={backPath} color="warning" outline class="border-0 m-2">
            <Icon name={path === 'root' ? 'arrow-left' : 'arrow-up'} class="h4"/>
        </Button>
    </Col>
</Row>
