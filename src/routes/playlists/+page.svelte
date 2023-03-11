<script lang="ts">
	import { Button, Card, Pagination, PlaylistForm } from '$components';
	import { toasts } from '$stores';
	import { Modal } from '$components';
	import MicroModal from 'micromodal';
	import type { PageData } from './$types';
	import type { ActionData } from './new/$types';

	export let data: PageData;
	export let form: ActionData;

	$: playlists = data.userPlaylists;
	let isLoading = false;

	// #region Functions
	const loadMoreItems = async () => {
		if (!playlists.next) return;

		isLoading = true;
		const res = await fetch(
			playlists.next.replace('https://api.spotify.com/v1/', '/api/spotify')
		);

		if (res.ok) {
			const resJSON = await res.json();
			playlists = {
				...resJSON,
				items: [...playlists.items, ...resJSON.items]
			};
		} else {
			toasts.error('Could not load data!');
		}
		isLoading = false;
	};
	// #endregion
</script>

<div class="content">
	{#if playlists.items.length > 0}
		<div class="title">
			<h1>{data.title}</h1>
			<Button
				element="a"
				href="/playlists/new"
				on:click={(e) => {
					e.preventDefault();
					MicroModal.show('add-playlist-modal');
				}}>Add new</Button
			>
		</div>
		<div class="grid-items">
			{#each playlists.items as item}
				<Card {item} />
			{/each}
		</div>
		<Pagination paginatedList={playlists} on:loadmore={loadMoreItems} />
	{:else}
		<div class="empty">
			<p>No playlists yet</p>
			<Button
				element="a"
				href="/playlists/new"
				on:click={(e) => {
					e.preventDefault();
					MicroModal.show('add-playlist-modal');
				}}>Add New</Button
			>
		</div>
	{/if}
</div>

<Modal id="add-playlist-modal" title="Add a new playlist">
	<!-- when invoking actions from different route we have to specify the action even if its a
	default one -->
	<PlaylistForm {form} userId={data.user?.id} action="/playlists/new" />
</Modal>

<style lang="scss">
	.content {
		padding-bottom: 60px;

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.grid-items {
			// space for pagination button
			margin-bottom: 40px;
		}

		.empty {
			text-align: center;
			margin-top: 40px;
			p {
				font-size: toRem(22);
				font-weight: 600;
			}
		}
	}
</style>
