<script lang="ts">
    import {
        Row,
        Col,
        Button,
        Icon
    } from 'sveltestrap'
    import { enhance } from '$app/forms'
    import { Toast } from '$lib/utils/alert'
    import { invalidateAll } from '$app/navigation'

    export let path

    const deleteThisFolder = async ({ data }) => {
        data.set('path', path)

        // TODO: await goBack()
        return ({ result }) => {
            if (result.type === 'success') {
                invalidateAll()
                Toast.fire({
                    title: 'Zložka úspešne vymazaná',
                    icon: 'success',
                    timer: 750
                })
            } else {
                Toast.fire({
                    title: 'Zložka nebola vymazaná',
                    icon: 'error',
                    timer: 750
                })
            }
        }
    }
</script>

<Col xs="12" class="d-flex justify-content-center align-items-center text-center">
    <Row>
        <Col>
            <Row>
                <Col>
                    <h1 class="text-muted">
                        Zložka je prázdna
                    </h1>
                </Col>
            </Row>
            {#if path !== 'root'}
                <Row>
                    <Col>
                        <form method="POST" action="?/deleteThisFolder" use:enhance={deleteThisFolder}>
                            <Button type="submit" color="danger" outline class="border-0 p-0">
                                <Icon name="trash" class="display-4"/>
                            </Button>
                        </form>
                    </Col>
                </Row>
            {/if}
        </Col>
    </Row>
</Col>
