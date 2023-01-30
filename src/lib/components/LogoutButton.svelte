<script>
	import { invalidateAll } from '$app/navigation';
</script>

<form
	method="POST"
	action="/api/auth/logout"
	on:submit|preventDefault={async () => {
		// in our endpoint we need to know are we calling it by submitting the form , or by using fetch
		// if we're using fetch we need to get 200 so that we can check if our request was successfull and call invalidateAll()
		// we'll do it by passing headers which we check for in the 'backend'
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				accept: 'application/json'
			}
		});
		// we're returning json from the 'api/auth/logout'
		// and we're doing it so we can check this
		if (response.ok) {
			const data = await response.json();
			if (data?.success) {
				invalidateAll();
			}
		}
	}}
>
	<button type="submit">Logout</button>
</form>
