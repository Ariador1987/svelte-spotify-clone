import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ data, url }) => {
	// we have access to anything that is in layout.server.ts in the data prop destructured from the event
	const { user } = data ?? {};
	if (user && url.pathname === '/login') {
		throw redirect(307, '/');
	}
	if (!user && url.pathname !== '/login') {
		throw redirect(307, '/login');
	}
	// if we have a shared function that runs for both the server and the client
	// we have to return the data from layout.server.ts in this shared function again
	return {
		user
	};
};
