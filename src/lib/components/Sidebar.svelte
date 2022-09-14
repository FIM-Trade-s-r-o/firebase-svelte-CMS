<script>
	import {
	    Row,
	    Col,
	    Button,
	    Icon, ButtonGroup
	} from 'sveltestrap'
</script>

<Row class="vh-100 position-sticky align-items-center" style="left: 0; top: 0">
	<Col>
		<h4 class="mb-5">
			Upravitelný obsah
		</h4>
		<ButtonGroup vertical class="w-100">
			<Button href="/dashboard/collections" color="dark" outline class="w-100 rounded-0">
				<Row class="justify-content-center">
					<Col xs="auto" class="me-auto">
						<Icon name="collection" class="h4"/>
					</Col>
					<Col>
						Zbierky <!--{$_('page.dashboard.collections')}-->
					</Col>
				</Row>
			</Button>
			<Button href="/dashboard/storage" color="dark" outline class="w-100 rounded-0">
				<Row class="justify-content-center">
					<Col xs="auto" class="me-auto">
						<Icon name="folder2" class="h4"/>
					</Col>
					<Col>
						Disk
					</Col>
				</Row>
			</Button>
		</ButtonGroup>
	</Col>
</Row>
