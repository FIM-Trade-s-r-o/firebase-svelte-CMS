<script lang="ts">
    import {
        Col,
        Card,
        CardBody,
        CardFooter,
        Icon
    } from "sveltestrap";

    export let value;
    const name = value.name;
</script>

<Col xs="12" sm="6" md="4" lg="3" xl="2" class="h-auto">
    <Card class="w-100 h-100">
        <CardBody class="d-flex justify-content-center">
            <Icon name="file-earmark" class="display-3"/>
        </CardBody>
        <CardFooter class="bg-white">
            <p class="m-0 text">
                {name}
            </p>
        </CardFooter>
    </Card>
</Col>