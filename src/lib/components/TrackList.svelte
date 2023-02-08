<script lang="ts">
	import { msToTime } from '$utils';
	import { Clock8, ListPlus } from 'lucide-svelte';
	export let tracks: SpotifyApi.TrackObjectFull[] | SpotifyApi.TrackObjectSimplified[];
</script>

<div class="tracks">
	<div class="row header">
		<div class="number-column">
			<span class="number">#</span>
		</div>
		<div class="info-column">
			<span class="track-title">A</span>
		</div>
		<div class="duration-column">
			<Clock8 aria-hidden focusable="true" color="var(--light-gray)" />
		</div>
		<div class="actions-column">asdf</div>
	</div>

	{#each tracks as track, index}
		<div class="row">
			<div class="number-column">
				<span class="number">{index + 1}</span>
			</div>
			<div class="info-column">
				<div class="track-title">
					<h4>{track.name}</h4>
					{#if track.explicit}
						<span class="explicit">explicit</span>
					{/if}
				</div>
				<p class="artists">
					{#each track.artists as artist, artistIndex}
						<a href="/artist/{artist.id}">{artist.name}</a>
						{#if artistIndex < track.artists.length - 1}
							{', '}
						{/if}
					{/each}
				</p>
			</div>
			<div class="duration-column">
				<span class="duration">{msToTime(track.duration_ms)}</span>
			</div>
			<div class="actions-column">
				<ListPlus aria-hidden focusable="false" />
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.tracks {
		.row {
			display: flex;
			align-items: center;
			padding: 7px 5px;
			border-radius: 4px;

			&.header {
				border-bottom: 1px solid var(--border);
				border-radius: 0px;
				padding: 5px;
				margin-bottom: 15px;

				.track-title {
					color: var(--light-gray);
					font-size: toRem(12);
					text-transform: uppercase;
				}

				.duration-column :global(svg) {
					width: 16px;
					height: 16px;
				}
			}

			&:not(.header) {
				&:hover {
					background-color: rgba(255, 255, 255, 0.05);
				}
			}

			.number-column {
				width: 30px;
				display: flex;
				justify-content: flex-end;
				margin-right: 15px;

				span.number {
					color: var(--light-gray);
					font-size: toRem(14);
				}
			}

			.info-column {
				flex: 1;

				.track-title {
					display: flex;
					align-items: center;

					h4 {
						margin: 0;
						font-size: toRem(15);
						font-weight: 400;
						line-height: 1;
					}

					span.explicit {
						text-transform: uppercase;
						font-size: toRem(8);
						margin-left: 10px;
						border: 1px solid;
						padding: 2px 3px;
						border-radius: 2px;
						line-height: toRem(10);
						color: var(--light-gray);
					}
				}

				.artists {
					color: var(--light-gray);
					font-size: toRem(13);
					margin: 7px 0 0;
					line-height: 1;

					a {
						color: inherit;
						text-decoration: none;
					}
				}
			}

			.duration-column {
				span.duration {
					color: var(--light-gray);
					font-size: toRem(14);
				}
			}

			.actions-column {
				width: 30px;
				margin-left: 15px;
			}
		}
	}
</style>