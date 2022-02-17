<script>
    import {
        Row,
        Col,
        Button,
        Icon
    } from "sveltestrap";
    import {auth, user} from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { Toast } from "$lib/utils/alert";
    import { handleAuthError } from "$lib/firebase/errorHandling";

    const logOut = async () => {
        try {
            await signOut(auth);
            Toast.fire({
                icon: 'success',
                title: `Úspešné odhlásenie`
            });
        } catch (error) {
            await handleAuthError(error)
        }
    }
</script>

<div class="h-100 d-flex flex-column">
    <Row class="justify-content-between align-items-center bg-dark">
        <Col xs="auto" class="text-white">
            {$user?.displayName || ""}
        </Col>
        <Col xs="auto">
            <Button on:click={logOut} outline color="warning" class="border-0 m-2">
                <Icon name="box-arrow-in-right"/>
            </Button>
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