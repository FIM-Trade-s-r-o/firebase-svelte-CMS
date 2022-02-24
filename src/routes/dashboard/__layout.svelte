<script>
    import {
        Col,
        Row
    } from "sveltestrap";
    import { user } from "$lib/firebase/index";
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import Sidebar from '$lib/components/Sidebar.svelte';

    $: if (!$user && browser) {
        goto('/')
    }
</script>

<Row class="h-100">
    <Col xs="12" md="3" xl="2" class="d-flex flex-column justify-content-center align-items-center bg-light">
	    <Sidebar />
    </Col>
    <Col xs="12" md="9" xl="10">
        <slot/>
    </Col>
</Row>