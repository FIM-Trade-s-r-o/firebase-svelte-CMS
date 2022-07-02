<script lang="ts">
	import {
	    Row,
	    Col,
	    ButtonGroup,
	    Button,
	    Icon
	} from 'sveltestrap'
	import config from '$lib/config'

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
<Row class="justify-content-center pt-4">
	<Col xs="8">
		<ButtonGroup flush class="w-100">
			{#each collections as { name }}
				<Button href="/dashboard/collections/{name}" color="primary" class="text-center mb-2">
					{name}
				</Button>
			{:else}
				Žiaden upravitelný obsah
				<!--{$_('page.dashboard.noCollections')}-->
			{/each}
		</ButtonGroup>
	</Col>
</Row>
