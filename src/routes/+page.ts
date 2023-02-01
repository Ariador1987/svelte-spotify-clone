import type { PageLoad } from './$types';
import { fetchRefresh } from '$utils';

export const load: PageLoad = async ({ fetch: _fetch, parent }) => {
	// retry pattern
	const fetch = (path: string) => fetchRefresh(_fetch, path);
	const { user } = await parent();

	const newReleases = fetch('/api/spotify/browse/new-releases?limit=6');
	const featuredPlaylists = fetch('/api/spotify/browse/featured-playlists?limit=6');
	const userPlaylists = fetch(`/api/spotify/users/${user?.id}/playlists?limit=6`);

	// for 3 of these get random categories
	const categoriesRes = await fetch(`/api/spotify/browse/categories`);
	const categoriesResJSON: SpotifyApi.MultipleCategoriesResponse | undefined = categoriesRes.ok
		? await categoriesRes.json()
		: undefined;

	const randomCategories = categoriesResJSON
		? categoriesResJSON.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3)
		: [];
	// fetch playlists for our random categories
	const randomCategoriesPromises = randomCategories.map((cat) =>
		fetch(`/api/spotify/browse/categories/${cat.id}/playlists?limit=6`)
	);

	const [newReleasesRes, featuredPlaylistsRes, userPlaylistsRes, ...randomCategoriesResp] =
		await Promise.all([
			newReleases,
			featuredPlaylists,
			userPlaylists,
			...randomCategoriesPromises
		]);

	// instead of throwing error we'll return undefined
	return {
		newReleases: newReleasesRes.ok
			? (newReleasesRes.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>)
			: undefined,
		userPlaylists: userPlaylistsRes.ok
			? (userPlaylistsRes.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>)
			: undefined,
		featuredPlaylists: featuredPlaylistsRes.ok
			? (featuredPlaylistsRes.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse>)
			: undefined,
		homeCategories: randomCategories,
		categoriesPlaylists: Promise.all(
			randomCategoriesResp.map((res) =>
				res.ok ? (res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse>) : undefined
			)
		)
	};
};
