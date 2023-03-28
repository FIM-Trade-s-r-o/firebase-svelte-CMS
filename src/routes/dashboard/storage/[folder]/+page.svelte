<script lang="ts">
    import {
        Row,
        Col
    } from 'sveltestrap'
    import FoldersList from './FoldersList.svelte'
    import FilesList from './FilesList.svelte'
    import Topbar from './Topbar.svelte'
    import EmptyFolder from './EmptyFolder.svelte'
    import LoadMoreFiles from './LoadMoreFiles.svelte'

    export let data

    const getBackPath = (path) => {
        if (path === '|') {
            return '/dashboard'
        } else if (path.includes('/')) {
            return `/dashboard/storage|${path}`
        } else {
            return '/dashboard/storage/|'
        }
    }

    let backPath = getBackPath(data.path)

    $: backPath = getBackPath(data.path)
</script>

<div class="h-100 d-flex flex-column">
    <Topbar path={data.path} {backPath} folders={data.folders} files={data.files}/>
    <Row class="flex-grow-1 pt-3">
        {#if data.folders.length === 0 && data.files.length === 0}
            <EmptyFolder path={data.path} {backPath}/>
        {/if}
        <Col>
            <Row>
                <FoldersList items={data.folders}/>
                <FilesList path={data.path} items={data.files}/>
                {#if data.nextPageToken}
                    <LoadMoreFiles path={data.path} bind:folders={data.folders} bind:files={data.files} bind:nextPageToken={data.nextPageToken}/>
                {/if}
            </Row>
        </Col>
    </Row>
</div>
