import { fetchRefresh } from '$utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const albumResponse = await fetchRefresh(fetch, `/api/spotify/albums/${params.id}`);

	if (!albumResponse.ok) throw error(albumResponse.status, 'Failed to load album');

	const albumJSON: SpotifyApi.SingleAlbumResponse = await albumResponse.json();

	let color = null;
	if (albumJSON.images.length > 0) {
		const colorRes = await fetch(
			`/api/average-color?${new URLSearchParams({
				image: albumJSON.images[0].url
			}).toString()}`
		);

		if (colorRes.ok) {
			color = (await colorRes.json()).color;
		}
	}

	return {
		album: albumJSON,
		// title for head
		title: albumJSON.name,
		color: color
	};
};
