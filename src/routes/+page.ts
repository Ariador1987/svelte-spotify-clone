import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

	const newReleases = fetch('/api/spotify/browse/new-releases?limit=6');
	const featuredPlaylists = fetch('/api/spotify/browse/featured-playlists?limit=6');
	const userPlaylists = fetch(`/api/spotify/users/${user?.id}/playlists?limit=6`);

	// for 3 of these get random categories
	const categoriesRes = await fetch(`/api/spotify/browse/categories`);
	if (!categoriesRes.ok) return undefined;
	const categoriesJSON = (await categoriesRes.json()) as SpotifyApi.MultipleCategoriesResponse;

	const randomCategories =
		categoriesJSON.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3) || [];

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

	console.log(randomCategoriesResp);

	// instead of throwing error we'll return undefined
	return {
		newRelases: newReleasesRes.ok
			? (newReleasesRes.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>)
			: undefined,
		userPlaylists: userPlaylistsRes.ok
			? (userPlaylistsRes.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>)
			: undefined,
		featuredPlaylists: featuredPlaylistsRes.ok
			? (featuredPlaylistsRes.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse>)
			: undefined,
		homeCategories: randomCategoriesResp,
		categoriesPlaylists: Promise.all(
			randomCategoriesResp.map((res) =>
				res.ok ? (res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse>) : undefined
			)
		)
	};
};
