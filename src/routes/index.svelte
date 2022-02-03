<script>
    import {
        Jumbotron
    } from "sveltestrap";
    import { _ } from 'svelte-i18n';
</script>

<svelte:head>
    <title>
        {$_('page.main.title')}
    </title>
</svelte:head>

<Jumbotron>
    {$_('page.main.text')}
</Jumbotron>