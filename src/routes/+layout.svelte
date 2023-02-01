<script lang="ts">
	import 'modern-normalize/modern-normalize.css';
	import { Navigation, Header } from '$components';
	// @ts-ignore
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { hideAll } from 'tippy.js';
	import { page } from '$app/stores';
	import '../styles/main.scss';
	import type { LayoutData } from './$types';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	NProgress.configure({ showSpinner: false });

	let topbar: HTMLElement;
	let scrollY: number;
	let headerOpacity = 0;

	export let data: LayoutData;
	$: user = data.user;

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

<div id="main" style:height="2000px">
	{#if user}
		<nav class="sidebar">
			<Navigation desktop={true} />
		</nav>
	{/if}
	<div id="content">
		{#if user}
			<div id="topbar" bind:this={topbar}>
				<div class="topbar-bg" style:opacity={`${headerOpacity}`} />
				<Header />
			</div>
		{/if}
		<main id="main-content" class:logged-in={user}>
			<slot />
		</main>
	</div>
</div>

<!-- style:background-color="var(--header-color)" -->
<style lang="scss">
	@use '@unsass/breakpoint';

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
				background-color: var(--header-color);
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: -1;
			}

			@include breakpoint.up('md') {
				padding: 0 30px;
				// we need to subtract the sidebar width
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
			}
		}
	}
</style>
