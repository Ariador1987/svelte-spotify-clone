<script lang="ts">
	import { page } from '$app/stores';
	import { LogoutButton, Navigation } from '$components';
	// to not have two navigations, we solve it by using browser
	import { browser } from '$app/environment';
	import { ChevronDown, ExternalLink } from 'lucide-svelte';
	import { tippy } from '$lib/actions';

	$: user = $page.data.user;
</script>

<div class="content">
	<div class="left">
		{#if browser}
			<Navigation desktop={false} />
		{/if}
	</div>
	<div class="right">
		<div id="profile-button">
			<button
				class="profile-button"
				use:tippy={{
					content: document.getElementById('profile-menu') || undefined,
					onMount: () => {
						const template = document.getElementById('profile-menu');
						if (template) {
							template.style.display = 'block';
						}
					},
					trigger: 'click',
					placement: 'bottom-end',
					interactive: true,
					theme: 'menu',
					hideOnPopperBlur: true
				}}
			>
				{#if user?.images && user.images.length > 0}
					<img src={user.images[0].url} alt="" />
				{/if}
				{user?.display_name}
				<span class="visually-hidden">Profile menu</span>
				<ChevronDown class="profile-arrow" size={20} />
			</button>
		</div>
		<div id="profile-menu" style:display="none">
			<div class="profile-menu-content">
				<ul>
					<li>
						<a
							href={user?.external_urls.spotify}
							target="_blank"
							rel="noopener noreferrer"
							>View on Spotify
							<ExternalLink focusable="false" aria-hidden />
						</a>
					</li>
					<li>
						<a href="/profile">View Profile</a>
					</li>
					<li>
						<LogoutButton />
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@use '@unsass/breakpoint';

	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		// to return the menu in no-js to the left
		&:global(html.no-js) & {
			@include breakpoint.down('md') {
				justify-content: flex-start;
			}
		}
	}

	.profile-button {
		background: none;
		border: 1px solid var(--border);
		padding: 5px;
		border-radius: 25px;
		@include flexCenter;
		color: var(--text-color);
		cursor: pointer;

		:global(html.no-js) & {
			display: none;
		}

		:global(.profile-arrow) {
			margin-left: 3px;
		}

		img {
			width: 28px;
			height: 28px;
			border-radius: 100%;
			margin-right: 10px;
		}

		&:hover {
			background-color: var(--accent-color);
		}
	}

	.profile-menu-content {
		padding: 5px 0;
		ul {
			padding: 0;
			margin: 0;
			list-style-type: none;

			li {
				&:hover {
					background: hsla(0, 100%, 100%, 0.07);
				}

				a :global(svg) {
					vertical-align: middle;
					margin-left: 10px;
				}

				a,
				:global(button) {
					display: inline-block;
					padding: 10px 15px;
					background: none;
					border: none;
					text-decoration: none;
					cursor: pointer;
					color: var(--menu-text-color);
					width: 100%;
					text-align: left;
					font-size: toRem(14);
				}
			}
		}
	}

	:global(html.no-js) {
		#profile-menu {
			display: block !important;
		}

		.profile-menu-content {
			ul {
				padding: 0;
				margin: 0;

				li {
					display: inline-block;
				}
			}
		}
	}
</style>
