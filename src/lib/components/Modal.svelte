<script lang="ts">
	import { X } from 'lucide-svelte';

	export let id: string;
	export let title: string;
</script>

<div {id} aria-hidden="true" class="modal">
	<div tabindex="-1" data-micromodal-close class="modal-overlay">
		<div role="dialog" aria-modal="true" aria-labelledby="{id}-title" class="modal-content">
			<header>
				<h2 id="{id}-title">{title}</h2>

				<button aria-label="Close modal" data-micromodal-close class="close-btn">
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
	.modal {
		display: none;

		// class added later by mMicroModal lib, so we need to global for it not get dissmissed
		&:global(.is-open) {
			display: block;
		}

		&-overlay {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.6);
			@include flexCenter;
			z-index: 9999;
		}

		&-content {
			background-color: var(--dark-gray);
			padding: 30px;
			max-width: 400px;
			max-height: 100vh;
			overflow-y: auto;
			border-radius: 4px;
			position: relative;
		}

		header {
			margin-right: 30px;

			h2 {
				font-size: toRem(26);
			}
		}
	}

	.close-btn {
		background: none;
		border: none;
		position: absolute;
		top: 10px;
		right: 10px;
		cursor: pointer;

		:global(svg) {
			stroke: var(--text-color);
		}
	}
</style>
