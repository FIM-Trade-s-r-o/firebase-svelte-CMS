<script lang="ts">
    import {
        Col,
        Row
    } from 'sveltestrap'
    import Sidebar from '$lib/components/Sidebar.svelte'
</script>

<Row class="h-100">
    <Col xs="12" md="3" xl="2" class="d-flex justify-content-center bg-light">
	    <Sidebar />
    </Col>
    <Col xs="12" md="9" xl="10" class="h-100 d-flex flex-column">
        <slot/>
    </Col>
</Row>
