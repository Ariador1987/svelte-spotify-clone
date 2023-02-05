<script lang="ts">
	import { Music } from 'lucide-svelte';
	type AlbumType = SpotifyApi.AlbumObjectFull | SpotifyApi.AlbumObjectSimplified;
	type PlaylistType = SpotifyApi.PlaylistObjectFull | SpotifyApi.PlaylistObjectSimplified;
	type ArtistType = SpotifyApi.ArtistObjectFull;

	export let item: AlbumType | PlaylistType | ArtistType;
</script>

<div class="card {item.type}">
	{#if item.images.length > 0}
		<img loading="lazy" src={item.images[0].url} alt="{item.type} cover for {item.name}" />
	{:else}
		<div class="cover-placeholder">
			<Music aria-hidden="true" focusable="false" color="var(--light-gray)" />
		</div>
	{/if}
	<h4 class="truncate-1">
		<a href="/{item.type}/{item.id}" title={item.name}>{item.name}</a>
	</h4>
	{#if item.type === 'album'}
		<p class="truncate-1">{item.artists.map((artist) => artist.name).join(', ')}</p>
	{/if}
	{#if item.type === 'playlist'}
		<p class="truncate-2">{item.description}</p>
	{/if}
</div>

<style lang="scss">
	.card {
		background-color: var(--dark-gray);
		padding: 10px;
		box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
		border-radius: 4px;
		transition: background-color 0.3s;
		position: relative;

		img {
			width: 100%;
			aspect-ratio: 1;
			object-fit: cover;
			margin: 0 0 20px;
		}

		h4 {
			margin: 0 0 10px;
			font-size: toRem(16);
			font-weight: 600;
			line-height: 1;

			a {
				text-decoration: none;
				color: var(--color-text);

				&:focus-visible {
					outline: none;

					&::after {
						content: '';
						outline: 2px solid var(--accent-color);
					}
				}

				&::after {
					content: '';
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					border-radius: 4px;
				}
			}
		}

		p {
			margin: 0;
			color: var(--light-gray);
			font-size: toRem(14);
			// so it can live on top of our pseudo element
			position: relative;
		}

		&:hover {
			background-color: var(--medium-gray);

			.cover-placeholder {
				background-color: var(--dark-gray);
			}
		}
	}

	.cover-placeholder {
		width: 100%;
		aspect-ratio: 1;
		@include flexCenter;
		background-color: var(--medium-gray);
		margin: 0 0 20px;
		transition: background-color 0.3s;

		:global(svg) {
			height: 40%;
			width: 40%;
		}
	}
</style>
