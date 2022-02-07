<script>
    import {
        Col,
        ListGroup, ListGroupItem,
        Row
    } from "sveltestrap";
    import { user } from "$lib/firebase/index";
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import {_} from "svelte-i18n";
    import { collections } from "$lib/config";

    $: if (!$user && browser) {
        goto('/')
    }

</script>

<Row class="h-100">
    <Col xs="12" md="3" xl="2" class="d-flex flex-column justify-content-center align-items-center bg-light">
        <h4 class="mb-5">
            Zbierky
            <!--{$_('page.dashboard.collections')}-->
        </h4>
        <ListGroup flush class="w-100">
            {#each collections as collection}
                <ListGroupItem href="/dashboard/{collection}" class="border-1 text-center mb-1">
                    {collection}
                </ListGroupItem>
            {:else}
                {$_('page.dashboard.noCollections')}
            {/each}
        </ListGroup>
    </Col>
    <Col xs="12" md="9" xl="10">
        <slot/>
    </Col>
</Row>