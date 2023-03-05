<script lang="ts">
	import { X } from 'lucide-svelte';

	export let id: string;
	export let title: string;
</script>

<div {id} aria-hidden="true">
	<div tabindex="-1" data-micromodal-close>
		<div role="dialog" aria-modal="true" aria-labelledby="{id}-title">
			<header>
				<h2 id="{id}-title">{title}</h2>

				<button aria-label="Close modal" data-micromodal-close>
					<X aria-hidden focusable="false" />
				</button>
			</header>

			<div id="{id}-content">
				<slot />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
</style>
