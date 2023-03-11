<script lang="ts">
	import 'modern-normalize/modern-normalize.css';
	import { Navigation, Header, Toasts, SearchForm } from '$components';
	// @ts-ignore
	import NProgress from 'nprogress';
	import MicroModal from 'micromodal';
	import 'nprogress/nprogress.css';
	import { hideAll } from 'tippy.js';
	import { page } from '$app/stores';
	import '../styles/main.scss';
	import type { LayoutData } from './$types';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { X } from 'lucide-svelte';

	NProgress.configure({ showSpinner: false });

	let topbar: HTMLElement;
	let scrollY: number;
	let headerOpacity = 0;

	export let data: LayoutData;
	$: user = data.user;
	$: userAllPlaylists = data.userAllPlaylists;

	$: hasError = $page.url.searchParams.get('error');
	$: hasSuccess = $page.url.searchParams.get('success');

	if (browser) {
		MicroModal.init();
	}

	$: if (topbar) {
		if (scrollY / topbar.offsetHeight < 1) {
			headerOpacity = scrollY / topbar.offsetHeight;
		} else {
			headerOpacity = 1;
		}
	}

	beforeNavigate(() => {
		NProgress.start();
		// tippy hide all menus
		hideAll();
	});
	afterNavigate(() => {
		NProgress.done();
	});
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>Spotify{$page.data.title ? ` - ${$page.data.title}` : ''}</title>
</svelte:head>

<!-- if we're logged out we don't have a menu at all and this resolves focus with menu concerned -->
{#if user}
	<a href="#main-content" class="skip-link">Skip to content</a>
{/if}

<Toasts />

<div id="main">
	{#if user}
		<nav class="sidebar">
			<Navigation desktop={true} {userAllPlaylists} />
		</nav>
	{/if}
	<div id="content">
		{#if hasError || hasSuccess}
			<div class="message" role="status" class:error={hasError} class:success={hasSuccess}>
				{hasError ?? hasSuccess}
				<a href={$page.url.pathname} class="close">
					<X aria-hidden focusable="false" />
					<span class="visually-hidden">Close message</span>
				</a>
			</div>
		{/if}

		{#if user}
			<div id="topbar" bind:this={topbar}>
				<div
					class="topbar-bg"
					style:opacity={`${headerOpacity}`}
					style:background-color={$page.data.color
						? $page.data.color
						: 'var(--header-color'}
				/>
				<Header {userAllPlaylists} />
			</div>
		{/if}
		<main id="main-content" class:logged-in={user}>
			{#if $page.url.pathname.startsWith('/search')}
				<div class="search-form">
					<SearchForm />
				</div>
			{/if}
			<slot />
		</main>
	</div>
</div>

<!-- style:background-color="var(--header-color)" -->
<style lang="scss">
	@use '@unsass/breakpoint';

	:global(body) {
		overflow-x: hidden;
	}

	#main {
		display: flex;

		:global(html.no-js) & {
			@include breakpoint.down('md') {
				display: block;
			}
		}

		#topbar {
			position: fixed;
			height: var(--header-height);
			padding: 0 15px;
			display: flex;
			align-items: center;
			width: 100%;
			z-index: 100;

			:global(html.no-js) & {
				position: sticky;
				top: 0;
				background-color: var(--header-color);
				// to prevent items collapsing on each other
				height: auto;
				padding: 10px 20px;

				@include breakpoint.up('md') {
					position: fixed;
				}
			}

			.topbar-bg {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: -1;
				background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
			}

			@include breakpoint.up('md') {
				padding: 0 30px;
				// we need to subtract the sidebar width so overlay doesn't overflow
				width: calc(100% - var(--sidebar-width));
				// width: 100%;
			}
		}

		#content {
			flex: 1;
			main#main-content {
				padding: 30px 15px 60px;

				@include breakpoint.up('md') {
					padding: 30px 30px 60px;
				}

				&.logged-in {
					padding-top: calc(3px + var(--header-height));

					:global(html.no-js) & {
						@include breakpoint.down('md') {
							padding-top: 30px;
						}
					}
				}

				.search-form {
					margin-bottom: 40px;

					@include breakpoint.up('lg') {
						display: none;
					}

					:global(input) {
						width: 100%;
					}
				}
			}

			.message {
				position: sticky;
				z-index: 9999;
				padding: 10px 20px;
				top: 0;

				&.error {
					background-color: var(--error);
				}

				&.success {
					background-color: var(--accent-color);
				}

				.close {
					position: absolute;
					right: 10px;
					top: 5px;

					:global(svg) {
						stroke: var(--text-color);
						vertical-align: middle;
					}

					&.focus {
						outline-color: #fff;
					}
				}
			}
		}
	}
</style>
