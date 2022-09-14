<script lang="ts">
    import {
        Row,
        Col
    } from 'sveltestrap'
    import FoldersList from './FoldersList.svelte'
    import FilesList from './FilesList.svelte'
    import Topbar from './Topbar.svelte'
    import EmptyFolder from './EmptyFolder.svelte'

    export let data
    const path = data.path
    const folders = data.folders
    const files = data.files
</script>

<div class="h-100 d-flex flex-column">
    <Topbar {path} {folders} {files}/>
    <Row class="flex-grow-1 pt-3">
        {#if folders.length === 0 && files.length === 0}
            <EmptyFolder {path}/>
        {/if}
        <Col>
            <Row>
                <FoldersList items={folders}/>
                <FilesList items={files}/>
            </Row>
        </Col>
    </Row>
</div>
