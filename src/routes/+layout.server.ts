import { SPOTIFY_BASE_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
	const accessToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');

	if (!accessToken) {
		return {
			user: null
		};
	}

	const profileRes = await fetch(`${SPOTIFY_BASE_URL}/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (profileRes.ok) {
		const profile: SpotifyApi.CurrentUsersProfileResponse = await profileRes.json();
		let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
		const userPlaylistsRes = await fetch('/api/spotify/me/playlists?limit=50');
		if (userPlaylistsRes.ok) {
			const userplaylistResJSON: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
				await userPlaylistsRes.json();
			userAllPlaylists = userplaylistResJSON.items;
		}
		return {
			user: profile,
			userAllPlaylists
		};
	}
	if (profileRes.status === 401 && refreshToken) {
		// refresh the token and try again
		const refreshResponse = await fetch('/api/auth/refresh');
		if (refreshResponse.ok) {
			// if we refreshed the token we need to retry the login again with updated tokens
			// route we tried to access initially is in url.pathname
			throw redirect(307, url.pathname);
		}
		return {
			user: null
		};
	} else {
		// in case of error set user to null
		return {
			user: null
		};
	}
};
