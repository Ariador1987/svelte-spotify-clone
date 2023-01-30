<script lang="ts">
	import 'modern-normalize/modern-normalize.css';
	import { Navigation, Header } from '$components';
	import '../styles/main.scss';
	import type { LayoutData } from './$types';

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
</script>

<svelte:window bind:scrollY />

<div id="main" style:height="2000px">
	{#if user}
		<nav class="sidebar">
			<Navigation desktop={true} />
		</nav>
	{/if}
	<div id="content">
		<div id="topbar" bind:this={topbar}>
			<div
				class="topbar-bg"
				style:background-color="var(--header-color)"
				style:opacity={`${headerOpacity}`}
			/>
			<Header />
		</div>
		<main id="main-content" class:logged-in={user}>
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
	@use '@unsass/breakpoint';

	#main {
		display: flex;

		#topbar {
			position: fixed;
			height: var(--header-height);
			padding: 0 15px;
			display: flex;
			align-items: center;
			width: 100%;
			z-index: 100;

			.topbar-bg {
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
				}
			}
		}
	}
</style>
