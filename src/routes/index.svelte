<script context="module" lang="ts">
    import { signInWithEmailAndPassword } from '@firebase/auth'
    import { auth } from '$lib/firebase'
    import { Toast } from '$lib/utils/alert'
    import config from '$lib/config/'

    const verifyUser = async (email, password) => {
        if (!config.isAdminAccount(email)) throw { code: 'userIsNotAdmin', message: '' }
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        await Toast.fire({
            icon: 'success',
            title: `Vitaj ${userCredential.user.displayName}`
        })
    }

    export {
        verifyUser
    }
</script>
<script lang="ts">
    import {
        Row,
        Col,
        Button,
        FormGroup,
        Input,
        Modal,
        ModalHeader,
        ModalBody
    } from 'sveltestrap'
    import {
        sendPasswordResetEmail
    } from '@firebase/auth'
    import { user } from '$lib/firebase'
    import { goto } from '$app/navigation'
    import { handleAuthError } from '$lib/firebase/errorHandling'
    import { browser } from '$app/env'

    let resetModalIsOpen = false
    let email = ''
    let password = ''


    const togglePasswordResetModal = () => {
        resetModalIsOpen = !resetModalIsOpen
    }
    const login = async () => {
        try {
            await verifyUser(email, password)
        } catch (error) {
            await handleAuthError(error)
        }
    }
    const resetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email)
            togglePasswordResetModal()
            await Toast.fire({
                icon: 'success',
                title: 'Email na reset hesla bol odoslaný'
            })
        } catch (error) {
            await handleAuthError(error)
        }
    }

    $: if ($user && browser) {
        goto('/dashboard')
    }
</script>

<Row class="min-h-100 align-content-center justify-content-center" style="padding-bottom: 30%">
    <Col xs="12" md="10" lg="8">
        <form on:submit|preventDefault={login}>
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
                <Col xs="12">
                    <Button color="link" type="button" on:click={togglePasswordResetModal} class="link-dark">
                        Neviem svoje heslo
                    </Button>
                </Col>
            </Row>
        </form>
    </Col>
</Row>

<Modal isOpen={resetModalIsOpen} toggle={togglePasswordResetModal}>
    <ModalHeader toggle={togglePasswordResetModal}>
        Reset hesla
    </ModalHeader>
    <ModalBody>
        <form on:submit|preventDefault={resetPassword}>
            <FormGroup>
                <label for="resetEmail">
                    E-mail
                </label>
                <Input bind:value={email} id="resetEmail" name="resetEmail" type="email" required
                       class="rounded-0 bg-light"/>
            </FormGroup>
            <Row class="justify-content-end">
                <Col xs="auto">
                    <Button type="submit" color="dark">
                        Resetovať
                    </Button>
                </Col>
            </Row>
        </form>
    </ModalBody>
</Modal>