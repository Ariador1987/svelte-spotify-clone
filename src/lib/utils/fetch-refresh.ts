import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export default async function fetchRefresh(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	path: string
) {
	// we need to use fetch that we get in the load function
	const request = fetch(path);
	if (!browser) return request;

	const res = await request;

	if (res.status === 401) {
		// we need to run this only once not mutliple times
		// we store the result of this promise in the window, so we know we're currently refreshing our token and we need to wait until its refreshed
		// since we need to run this only once we need this check
		if (!window.refreshPromise) {
			window.refreshPromise = fetch('/api/auth/refresh').finally(() => {
				window.refreshPromise = null;
			});
		}
		// so we don't continue retrying if our refresh token is also invalid
		const refreshRes = await window.refreshPromise;
		if (!refreshRes.ok) throw error(401, 'Session expired');
		return fetch(path);
	} else {
		return res;
	}
}
