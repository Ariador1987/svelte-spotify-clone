<script lang="ts">
	import logo from '$assets/Spotify_Logo_RGB_White.png';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { Home, Search, ListMusic, Menu, X, type Icon } from 'lucide-svelte';
	import { IconButton } from '$components';
	import { tick, type ComponentType } from 'svelte';
	import { beforeNavigate } from '$app/navigation';

	export let desktop: boolean;
	// state to decide of mobile navigation is open or closed
	// in the desktop state its always open , and in mobile it depends on the hamburger click
	let isMobileMenuOpen = false;
	$: isOpen = desktop || isMobileMenuOpen;

	// for focusing
	let openMenuButton: IconButton;
	let closeMenuButton: IconButton;
	// focusTrap
	let lastFocusableElement: HTMLAnchorElement;

	const menuItems: {
		path: string;
		label: string;
		icon: ComponentType<Icon>;
	}[] = [
		{
			label: 'Home',
			path: '/',
			icon: Home
		},
		{
			path: '/search',
			label: 'Search',
			icon: Search
		},
		{
			path: '/playlists',
			label: 'Playlists',
			icon: ListMusic
		}
	];

	const openMenu = async () => {
		isMobileMenuOpen = true;
		// first we need to move the visibility in is-hidden class for this to work
		// and we talked that when we manipulate state its not guaranteed our DOM will be instantly updated => we need the tick() here.
		await tick();
		closeMenuButton.getButton().focus();
	};

	const closeMenu = async () => {
		isMobileMenuOpen = false;
		await tick();
		openMenuButton.getButton().focus();
	};

	const moveFocusToBottom = (e: KeyboardEvent) => {
		if (desktop) return;
		if (e.key === 'Tab' && e.shiftKey) {
			e.preventDefault();
			lastFocusableElement.focus();
		}
	};

	const moveFocusToTop = (e: KeyboardEvent) => {
		if (desktop) return;
		if (e.key === 'Tab' && !e.shiftKey) {
			e.preventDefault();
			closeMenuButton.getButton().focus();
		}
	};

	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeMenu();
		}
	};

	beforeNavigate(() => {
		isMobileMenuOpen = false;
	});
</script>

<!-- Disabling scrolling if mobile menu is open -->
<svelte:head>
	{#if !desktop && isMobileMenuOpen}
		<style>
			body {
				overflow: hidden;
			}
		</style>
	{/if}
</svelte:head>

<div class="nav-content" class:desktop class:mobile={!desktop}>
	{#if !desktop && isMobileMenuOpen}
		<div
			class="overlay"
			on:click={closeMenu}
			on:keyup={handleEscape}
			transition:fade={{ duration: 200 }}
		/>
	{/if}
	<nav aria-label="Main">
		{#if !desktop}
			<IconButton
				icon={Menu}
				label={'Open Menu'}
				on:click={openMenu}
				aria-expanded={isOpen}
				bind:this={openMenuButton}
				class="menu-button"
			/>
		{/if}
		<div
			class="nav-content-inner"
			class:is-hidden={!isOpen}
			style:visibility={isOpen ? 'visible' : 'hidden'}
			on:keyup={handleEscape}
		>
			{#if !desktop}
				<IconButton
					icon={X}
					label={'Close'}
					bind:this={closeMenuButton}
					on:click={closeMenu}
					on:keydown={moveFocusToBottom}
					class="close-menu-button"
				/>
			{/if}
			<img src={logo} class="logo" alt="Spotify" />
			<ul>
				{#each menuItems as item, index}
					{@const iconProps = {
						focusable: 'false',
						'aria-hidden': 'true',
						color: 'var(--text-color)',
						size: 26
					}}
					<li class:active={item.path === $page.url.pathname}>
						{#if menuItems.length === index + 1}
							<a
								href={item.path}
								bind:this={lastFocusableElement}
								on:keydown={moveFocusToTop}
							>
								<svelte:component this={item.icon} {...iconProps} />{item.label}</a
							>
						{:else}
							<a href={item.path} bind:this={lastFocusableElement}>
								<svelte:component this={item.icon} {...iconProps} />{item.label}</a
							>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</nav>
</div>

<style lang="scss">
	@use '@unsass/breakpoint';

	.nav-content {
		.logo {
			max-width: 100%;
			width: 130px;
		}

		.overlay {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background-color: var(--sidebar-color);
			opacity: 0.75;
			z-index: 100;

			@include breakpoint.up('md') {
				display: none;
			}
		}

		&.desktop {
			position: sticky;
			top: 0;
			.nav-content-inner {
				@include breakpoint.up('md') {
					display: block;
				}
			}
		}

		&.mobile .nav-content-inner {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			transition: transform 200ms, opacity 200ms;
			opacity: 1;

			&.is-hidden {
				transition: transform 200ms, opacity 200ms, visibility 200ms;
				transform: translateX(-100%);
				opacity: 0;
			}

			@include breakpoint.down('md') {
				display: block;
			}
		}

		&-inner {
			// styling for js disabled
			:global(html.no-js) & {
				@include breakpoint.down('md') {
					display: block;
					height: auto;
				}
			}

			padding: 20px;
			min-width: var(--sidebar-width);
			background-color: var(--sidebar-color);
			height: 100vh;
			overflow: auto;
			display: none;

			ul {
				padding: 0;
				margin: 20px 0 0;
				list-style-type: none;

				li {
					a {
						display: flex;
						align-items: end;
						text-decoration: none;
						color: var(--text-color);
						font-size: toRem(14);
						padding: 5px;
						margin: 10px 0;
						opacity: 0.7;
						transition: opacity 0.2s;

						&:hover,
						&:focus {
							opacity: 1;
						}
					}

					&.active {
						a {
							opacity: 1;
						}
					}

					:global(svg) {
						margin-right: 12px;
					}
				}
			}
		}

		:global(.menu-button) {
			@include breakpoint.up('md') {
				display: none;
			}
		}

		:global(.close-menu-button) {
			position: absolute;
			right: 20px;
			top: 20px;
		}
	}
</style>
