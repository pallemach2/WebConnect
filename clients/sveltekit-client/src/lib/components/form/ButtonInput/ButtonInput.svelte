<script lang="ts">
	import './ButtonInput.scss';

	export let type: 'primary' | 'secondary' = 'primary';
	export let label: string = '';
	export let loading: boolean = false;
	export let onClick: () => void = () => {};

	function action() {
		if (!loading) onClick();
	}
</script>

<button class="button-input {type}" on:click={action} disabled={loading}>
	{#if loading}
		<div class="loading-circle"></div>
	{:else}
		{label}
		<slot></slot>
	{/if}
</button>
