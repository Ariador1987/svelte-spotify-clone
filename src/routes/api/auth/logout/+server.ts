import { json, redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = ({ cookies, request }) => {
	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('access_token', { path: '/' });

	// here we're checking if we're using fetch handling that case
	// and returning json object so we can have response.ok response.status et cetera
	if (request.headers.get('accept') === 'application/json') {
		return json({ success: true });
	}

	throw redirect(303, '/login');
};
