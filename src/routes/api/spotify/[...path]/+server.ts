import type { RequestHandler } from './$types';
import { SPOTIFY_BASE_URL } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, cookies, params, url }) => {
	const accessToken = cookies.get('access_token');

	// url.search returns params as string, searchParams returns as object
	const response = await fetch(`${SPOTIFY_BASE_URL}/${params.path}${url.search}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	const responseJSON = await response.json();

	if (responseJSON.error) {
		throw error(responseJSON.error.status, responseJSON.error.message);
	}

	return json(responseJSON);
};
