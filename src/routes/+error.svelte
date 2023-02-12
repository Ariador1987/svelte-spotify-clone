<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$components';

	let isRetrying = false;
	const retryRoutes = ['/albums/[id]', '/playlist/[id]'];
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div class="content">
	<h1>{$page?.error?.message}</h1>

	{#if $page.status === 404}
		<p>The page you're trying to access can't be found</p>
		<div class="buttons">
			<Button element="a" href="/">Home</Button>
			<Button element="a" href="/search">Home</Button>
		</div>
	{/if}

	{#if $page.status === 401}
		<p>Your current session has expired, please logout and login again</p>
		<Button element="a" href="/api/auth/login">Login</Button>
	{/if}

	{#if ![401, 404].includes($page.status) && $page.route.id && retryRoutes.includes($page.route.id)}
		<div class="buttons">
			<Button
				element="button"
				disabled={isRetrying}
				on:click={async () => {
					isRetrying = true;
					await invalidate(`app:${$page.route.id}`);
					isRetrying = false;
				}}>Retry</Button
			>
		</div>
	{/if}
</div>

<style lang="scss">
	.content {
		text-align: center;
	}
	h1 {
		font-size: toRem(40);
	}
	p {
		font-size: toRem(20);
	}
	.buttons {
		margin-top: 40px;
		:global(a) {
			margin: 0 5px;
		}
	}
</style>
