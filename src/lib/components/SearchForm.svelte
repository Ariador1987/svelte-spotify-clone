<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Search } from 'lucide-svelte';

	let searchInput: HTMLInputElement;

	afterNavigate(() => searchInput.focus());

	$: searchQuery = $page.params.query || '';
</script>

<form action="/search" method="GET" role="search">
	<div class="search-input-wrapper">
		<Search aria-hidden="false" focusable="false" />
		<input
			bind:this={searchInput}
			value={searchQuery}
			type="search"
			class="search-input"
			name="q"
			size="30"
			placeholder="Search for albums, artists or playlists."
			aria-label="Search for albums, artists or playlists."
		/>
	</div>
</form>

<style lang="scss">
	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;

		:global(svg) {
			position: absolute;
			margin-left: 10px;
			stroke: var(--medium-gray);
			width: 22px;
			height: 22px;
		}

		.search-input {
			border: none;
			padding: 0 20px 0 40px;
			height: calc(var(--header-height) - 25px);
			border-radius: 20px;
			font-size: toRem(14);
			color: var(--medium-gray);
		}
	}
</style>
