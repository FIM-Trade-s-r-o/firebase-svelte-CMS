<script lang="ts">
    import { Container } from 'sveltestrap'
    import 'bootstrap/scss/bootstrap.scss'
    import '$lib/scss/custom.scss'
    import 'bootstrap-icons/font/bootstrap-icons.css'
    import '$lib/locales/index.ts'
    import 'sweetalert2/src/sweetalert2.scss'
    import '$lib/fonts/comfortaa/comfortaa.css'

    // $: console.log($user)
</script>

<Container fluid class="h-100 w-100">
    <slot/>
</Container>