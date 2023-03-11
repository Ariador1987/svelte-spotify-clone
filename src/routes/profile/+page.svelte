<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Button, Card, ItemPage } from '$components';
	import type { PageData } from '../$types';

	export let data: PageData;
	$: user = data.user;
	$: color = data?.color ?? null;
	$: following = data.following;
	let isRetrying = false;

	// if Followers number is huge, like above 5 million we need to format it
	const followersFormat = Intl.NumberFormat('en', {
		notation: 'compact'
	});
</script>

<div id="profile-page">
	<ItemPage
		{color}
		title={user?.display_name || ''}
		image={user?.images && user?.images?.length > 0 ? user.images[0].url : undefined}
		type={user?.type}
	>
		<span slot="meta" class="following-count"
			>{followersFormat.format(user?.followers?.total ?? 0)} Followers</span
		>

		{#if following === undefined}
			<div class="fail">
				<p>Failed to load data</p>
				<Button
					element="button"
					disabled={isRetrying}
					on:click={async () => {
						isRetrying = true;
						await invalidate((url) => url.pathname === `/api/spotify/me/following`);
						isRetrying = false;
					}}>Retry</Button
				>
			</div>
		{/if}

		{#if following && following.artists.items.length > 0}
			<div class="following">
				<h2>following</h2>
				<div class="grid-items">
					{#each following.artists.items as artist}
						<div class="grid-item">
							<Card item={artist} />
						</div>
					{/each}
				</div>
			</div>
			<div class="view-all-button">
				<Button element="a" variant="outline" href="/profile/following"
					>View All <span class="visually-hidden">artists that you are following</span
					></Button
				>
			</div>
		{/if}
	</ItemPage>
</div>

<style lang="scss">
	@use '@unsass/breakpoint';

	#profile-page {
		:global(.banner) {
			align-items: center;
			text-align: center;
			@include breakpoint.up('sm') {
				text-align-last: left;
			}

			:global(.cover-placeholder) {
				border-radius: 100%;
				width: 200px;
				height: 200px;
			}
		}

		.following-count {
			font-size: toRem(14);
			color: var(--light-gray);
		}

		.following {
			margin-top: 30px;
			h2 {
				font-size: toRem(24);
				margin-bottom: 0.7em;
			}
		}
		.view-all-button {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 20px;
		}

		.fail {
			text-align: center;
			margin-top: 40px;
		}
	}
</style>
