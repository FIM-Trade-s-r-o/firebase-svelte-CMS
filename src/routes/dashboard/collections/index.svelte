<script>
	import {
		Row,
		Col,
		ButtonGroup,
		Button
	} from 'sveltestrap';
	import config from '$lib/config/index';
	
	const collections = config.collections;
</script>

<Row class="justify-content-center my-5">
	<Col xs="auto">
		<h2>
			Zbierky
		</h2>
	</Col>
</Row>
<Row class="justify-content-center">
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
