<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: console.log(data.categoriesPlaylists?.map((p) => p?.playlists.items));
</script>

<style lang="scss">
</style>
