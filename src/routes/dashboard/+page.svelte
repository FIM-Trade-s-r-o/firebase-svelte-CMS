<script lang="ts">
    import {
        Row,
        Col,
        Button,
        Icon
    } from 'sveltestrap'
    import { Toast } from '$lib/utils/alert'
    import { handleAuthError } from '$lib/firebase/errorHandling'
    import { applyAction, enhance } from '$app/forms'

    export let data

    const logOut = () => {
        return async ({ result }) => {
            if (result.type === 'failure') {
                await handleAuthError(result.data.error)
                return
            }
            Toast.fire({
                icon: 'success',
                title: 'Úspešné odhlásenie'
            })
            await applyAction(result)
        }
    }
</script>

<div class="h-100 d-flex flex-column">
    <Row class="justify-content-between align-items-center bg-dark">
        <Col xs="auto" class="text-white">
	        <h4 class="my-3">
		        {data?.user?.name || ''}
	        </h4>
        </Col>
        <Col xs="auto">
            <form method="POST" action="?/logOut" use:enhance={logOut}>
                <Button outline color="warning" class="border-0 m-2">
                    <Icon name="box-arrow-in-right"/>
                </Button>
            </form>
        </Col>
    </Row>
    <Row class="flex-grow-1 justify-content-center align-items-center">
        <Col xs="auto" class="text-center">
            <h2>
                Návod
            </h2>
            <p>
                Pre úpravu obsahu vyberte zbierku (dokumentov), potom môžete pridať, odstrániť alebo vybrať dokument na úpravu.
            </p>
        </Col>
    </Row>
</div>
