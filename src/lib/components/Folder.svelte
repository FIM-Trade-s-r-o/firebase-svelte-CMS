<script lang="ts">
    import {
        Col,
        Card,
        CardBody,
        CardFooter,
        Icon, Button
    } from 'sveltestrap'

    export let value

    $: name = value.name
    $: path = value.fullPath.replaceAll('/', '|')
</script>

<Col xs="12" sm="6" md="4" lg="3" xl="2" class="h-auto mb-4">
    <Button href="/dashboard/storage/{path}" color="transparent" class="h-100 w-100 m-0 p-0">
        <Card class="w-100 h-100">
            <CardBody class="d-flex justify-content-center">
                <Icon name="folder" class="display-3"/>
            </CardBody>
            <CardFooter class="bg-white">
                <p class="m-0 text">
                    {name}
                </p>
            </CardFooter>
        </Card>
    </Button>
</Col>
