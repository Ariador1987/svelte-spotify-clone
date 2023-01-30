<script lang="ts">
	import { Navigation } from '$components';
	// to not have two navigations, we solve it by using browser
	import { browser } from '$app/environment';
</script>

<div class="content">
	<div class="left">
		{#if browser}
			<Navigation desktop={false} />
		{/if}
	</div>
	<div class="right">Right</div>
</div>

<style lang="scss">
	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
</style>
