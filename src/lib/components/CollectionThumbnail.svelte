<script lang="ts">
    import {
        Button,
        Card,
        CardBody,
        CardFooter,
        Col,
        Icon
    } from 'sveltestrap'
    export let collection
</script>

<Col xs="12" sm="6" md="4" lg="3" xl="2" class="h-auto mb-4">
    <Button href="/dashboard/collections/{collection}" color="transparent" class="h-100 w-100 m-0 p-0">
        <Card class="w-100 h-100">
            <CardBody class="d-flex justify-content-center">
                <Icon name="collection" class="display-3"/>
            </CardBody>
            <CardFooter class="bg-white">
                <p class="m-0 text">
                    {collection}
                </p>
            </CardFooter>
        </Card>
    </Button>
</Col>
