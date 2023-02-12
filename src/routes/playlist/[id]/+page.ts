import { fetchRefresh } from '$utils';
import type { PageLoad } from '../../$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch: _fetch, params, depends, route, url, parent }) => {
	depends(`app:${route.id}`);
	const { user } = await parent();
	const fetch = (path: string) => fetchRefresh(_fetch, path);

	// disabled JS loading
	const limit = 100;
	const page = url.searchParams.get('page');

	// when we do this initially page will be one so above we need to override the page if its not one.
	const [playlistRes, isFollowingRes] = await Promise.all([
		fetch(`/api/spotify/playlists/${params.id}`),
		fetch(
			`/api/spotify/playlists/${params.id}/followers/contains?${new URLSearchParams({
				ids: user ? user.id : ''
			}).toString()}`
		)
	]);

	if (!playlistRes.ok) {
		throw error(playlistRes.status, 'Failed to load playlist');
	}

	let isFollowing: boolean | null = null;

	if (isFollowingRes.ok) {
		// returns array of booleans that represents if each user is following, we have only one user
		const isFollowingJSON: SpotifyApi.UsersFollowPlaylistResponse = await isFollowingRes.json();
		isFollowing = isFollowingJSON[0];
	}

	const playlistResJSON: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();

	if (page && page !== '1') {
		const tracksRes = await fetch(
			`/api/spotify/playlists/${params.id}/tracks?${new URLSearchParams({
				limit: `${limit}`,
				offset: `${limit * (Number(page) - 1)}`
			}).toString()}`
		);

		if (!tracksRes.ok) {
			throw error(tracksRes.status, 'Failed to load playlist');
		}

		const tracksResJSON = await tracksRes.json();
		// we need to use these tracks and replace the previous tracks if the page is different from 1
		playlistResJSON.tracks = tracksResJSON;
	}

	// if we have images in the response, get first's image color avg
	let color = null;
	if (playlistResJSON.images.length > 0) {
		const colorRes = await fetch(
			`/api/average-color?${new URLSearchParams({
				image: playlistResJSON.images[0].url
			}).toString()}`
		);

		if (colorRes.ok) {
			color = (await colorRes.json()).color;
		}
	}

	return {
		playlist: playlistResJSON,
		color,
		title: playlistResJSON.name,
		isFollowing
	};
};
