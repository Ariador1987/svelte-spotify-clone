<script lang="ts" context="module">
	let current: HTMLAudioElement;
</script>

<script lang="ts">
	import { Pause, Play } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	type Track = SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified;
	const dispatch = createEventDispatcher<{
		play: { track: Track };
		pause: { track: Track };
	}>();

	export let track: Track;
	let audio: HTMLAudioElement;
	let paused = true;

	const onPlay = () => {
		// if current differs from our bound one...
		// to make the player play one song at a time
		if (current && current !== audio) {
			// pos reset to 0
			current.currentTime = 0;
			current.pause();
		}
		current = audio;
		dispatch('play', { track });
	};

	const onPause = () => {
		dispatch('pause', { track });
	};
</script>

<div class="player">
	<audio
		bind:this={audio}
		bind:paused
		on:play={onPlay}
		on:pause={onPause}
		controls
		src={track.preview_url ?? track.uri}
		preload="none"
	/>
	<button
		aria-label={paused ? `Play ${track.name}` : `Pause ${track.name}`}
		on:click={() => {
			if (paused) {
				audio.play();
			} else {
				audio.pause();
			}
		}}
	>
		{#if paused}
			<Play color="var(--text-color)" focusable="false" aria-hidden />
		{:else}
			<Pause color="var(--text-color)" focusable="false" aria-hidden />
		{/if}
	</button>
</div>

<style lang="scss">
	//hide html audio player
	.player {
		audio {
			display: none;

			:global(html.no-js) & {
				display: block;
				width: 100%;
			}
		}
		button {
			width: 12px;
			height: 12px;
			padding: 0;
			background: none;
			border: none;
			cursor: pointer;

			:global(svg) {
				fill: var(--text-color);
				width: 12px;
				height: 12px;
			}
		}
	}
</style>
