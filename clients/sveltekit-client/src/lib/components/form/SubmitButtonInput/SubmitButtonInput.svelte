<script lang="ts">
	// Styling
	import './SubmitButtonInput.scss';

	// Props
	export let type: 'primary' | 'secondary' = 'primary';
	export let label: string;
	export let loading: boolean = false;
</script>

<button type="submit" class="submit-button-input {type}" disabled={loading}>
	{#if loading}
		<div class="loading-circle"></div>
	{:else}
		{label}
	{/if}
</button>
