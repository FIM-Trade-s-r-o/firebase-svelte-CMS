<script lang="ts">
    import {
        Row,
        Col,
        Button,
        FormGroup,
        Input
    } from 'sveltestrap'
    import { handleAuthError } from '$lib/firebase/errorHandling'
    import { applyAction, enhance } from '$app/forms'
    import { Toast } from '$lib/utils/alert'

    let email = ''
    let password = ''

    const login = () => {
        return async ({ result }) => {
            if (result.type === 'failure') {
                await handleAuthError(result.data)
                return
            }
            await applyAction(result)
            Toast.fire({
                icon: 'success',
                title: 'Vitaj'
            })
        }
    }

</script>

<Row class="min-h-100 align-content-center justify-content-center" style="padding-bottom: 30%">
    <Col xs="12" md="10" lg="8">
        <form method="POST" action="?/login" use:enhance={login}>
            <Row>
                <Col xs="12">
                    <h1 class="text-center">
                        <!--{$_('page.login.title')}-->
                        Prihlásenie
                    </h1>
                </Col>
            </Row>
            <Row class="justify-content-center">
                <Col xs="12" md="6">
                    <FormGroup>
                        <label for="email">
                            E-mail
                        </label>
                        <Input bind:value={email} id="email" name="email" type="email" required class="rounded-0 bg-light"/>
                    </FormGroup>
                </Col>
            </Row>
            <Row class="justify-content-center">
                <Col xs="12" md="6">
                    <FormGroup>
                        <label for="password">
                            Heslo
                        </label>
                        <Input bind:value={password} id="password" name="password" type="password" required
                               class="rounded-0 bg-light"/>
                    </FormGroup>
                </Col>
            </Row>
            <Row class="text-center">
                <Col xs="12" class="my-2">
                    <Button color="dark" type="submit">
                        PRIHLÁSIŤ SA
                    </Button>
                </Col>
            </Row>
        </form>
    </Col>
</Row>
