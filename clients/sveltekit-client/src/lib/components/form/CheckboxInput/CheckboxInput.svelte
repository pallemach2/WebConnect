<script lang="ts">
	// Styling
	import './CheckboxInput.scss';

	// Props
	export let label: string;
	export let value: boolean = false;
</script>

<div class="checkbox-input-container" on:click={() => (value = !value)}>
	<label for={label.replace(' ', '-')}>{label}</label>
	<input type="checkbox" name={label.replace(' ', '-')} on:click={() => (value = !value)} />
	<div class={'checkbox ' + (value && 'checked')}>
		{#if value}
			<div class="checked-marker"></div>
		{/if}
	</div>
</div>
