// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// got SpotifyApi types from @types/spotify-api
		interface PageData {
			user: SpotifyApi.CurrentUsersProfileResponse | null;
			title?: string;
		}
		// interface Platform {}
	}
}

export {};
