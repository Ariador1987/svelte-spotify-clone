import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import type { RequestHandler } from '../auth/callback/$types';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const imageURL = url.searchParams.get('image');
	if (imageURL) {
		// download image to pass it to library
		const image = await fetch(imageURL).then((res) => res.arrayBuffer());
		// the resp object contains 'mean' attr for r,g,b.
		const stats = await sharp(Buffer.from(image)).stats();
		const [r, g, b] = stats.channels.map((x) => x.mean);
		return json({
			color: `rgba(${r},${g},${b})`
		});
	}

	return json({
		color: null
	});
};
