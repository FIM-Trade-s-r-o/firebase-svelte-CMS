<script lang="ts">
    import {
        Row,
        Col
    } from "sveltestrap";
    import type Schema from "$lib/schemas/lib";

    export let schema: Schema;
</script>


<Row class="border-bottom border-dark text-center">
    {#each schema.properties as property}
        <Col>
            <h5 class="text-capitalize">
                {property}
            </h5>
        </Col>
    {/each}
</Row>
