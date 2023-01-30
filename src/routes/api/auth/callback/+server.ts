import { BASE_URL, SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from '../login/$types';

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	const code = url.searchParams.get('code') || null;
	const state = url.searchParams.get('state') || null;
	// for security reasons first thing we need to match the state to the one we sent in redirect
	// we'll do it by after creating it (on the login/+server.ts) store it in a cookie then check
	// does it match this one on return
	const storedState = cookies.get('spotify_auth_state') || null;
	const storedVerified = cookies.get('spotify_auth_challenge_verifier') || null;

	if (state === null || state !== storedState) {
		throw error(400, 'State mismatch');
	}

	// if state is fine we need to send a POST request to get access/refresh tokens
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(
				`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`
			).toString('base64')}`
		},
		body: new URLSearchParams({
			code: code ?? '',
			redirect_uri: `${BASE_URL}/api/auth/callback`,
			grant_type: 'authorization_code',
			code_verifier: storedVerified ?? '',
			client_id: SPOTIFY_APP_CLIENT_ID
		})
	});
	const responseJSON = await response.json();
	// handle erros by checking responseJSON object for errors and stop the auth flow
	if (responseJSON.error) {
		throw error(400, responseJSON.error_description);
	}
	// if we dont have the errors , store the tokens in cookies
	cookies.set('refresh_token', responseJSON.refresh_token, { path: '/' });
	cookies.set('access_token', responseJSON.access_token, { path: '/' });
	// delete the old cookies which were set for state mismatch and for state verifying
	cookies.delete('spotify_auth_state');
	cookies.delete('spotify_auth_challenge_verifier');
	// now redirect to our homepage
	// 303 because we're changing from POST to GET
	throw redirect(303, '/');
};
