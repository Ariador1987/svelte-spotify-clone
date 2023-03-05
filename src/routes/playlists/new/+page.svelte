<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, PlaylistForm } from '$components';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	// we need to pass this form to our component now.
	export let form: ActionData;
</script>

<h2>Add a new playlist</h2>
<PlaylistForm userId={data.user?.id} {form} action="?redirect" />

<style lang="scss">
</style>
