<script lang="ts">
	import {
	    Row,
	    Col,
	    Button,
	    Icon
	} from 'sveltestrap'
	import config from '$lib/config'
	import CollectionThumbnail from '$lib/components/CollectionThumbnail.svelte'

	const collections = config.collections
</script>

<Row class="justify-content-end align-items-center bg-dark">
	<Col class="text-white">
		<h4 class="my-3">
			Zbierky
		</h4>
	</Col>
	<Col xs="auto">
		<Button href="/dashboard" color="warning" outline class="border-0 m-2">
			<Icon name="arrow-left" class="h4"/>
		</Button>
	</Col>
</Row>
<Row class="px-1 py-3">
	{#each collections as { name }}
		<CollectionThumbnail collection={name}/>
	{:else}
		Žiaden upravitelný obsah
		<!--{$_('page.dashboard.noCollections')}-->
	{/each}
</Row>
