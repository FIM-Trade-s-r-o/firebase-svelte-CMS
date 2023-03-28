<script lang="ts">
    import { Button, Card, CardBody, CardFooter, Col, Icon } from 'sveltestrap'
    import { enhance } from '$app/forms'
    import { Toast } from '$lib/utils/alert'

    export let path: string
    export let files
    export let folders
    export let nextPageToken: string

    const moreFilesEnhancer = () => {
        return async ({ result }) => {
            if (result.type !== 'success') {
                Toast.fire({
                    title: 'Nepodarilo sa načitať ďalšie súbory',
                    icon: 'error'
                })
                return
            }
            files = [
                ...files,
                ...result.data.files
            ]
            folders = [
                ...folders,
                ...result.data.folders
            ]
            nextPageToken = result.data.nextPageToken
        }
    }

</script>

<Col xs="12" sm="6" md="4" lg="3" xl="2" class="h-auto mb-4">
    <form method="post" action="/dashboard/storage/{path}?/getMoreFiles" role="search" use:enhance={moreFilesEnhancer} class="w-100 h-100">
        <input type="hidden" name="nextPageToken" value="{nextPageToken}"/>
        <Button color="" class="w-100 h-100 text-decoration-none text-body p-0">
            <Card class="w-100 h-100">
                <CardBody class="d-flex justify-content-center">
                    <Icon name="arrow-right" class="display-3"/>
                </CardBody>
                <CardFooter class="bg-white">
                    <p class="m-0 text">
                        Načítať dalšie súbory
                    </p>
                </CardFooter>
            </Card>
        </Button>
    </form>
</Col>
