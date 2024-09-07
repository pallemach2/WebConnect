<script lang="ts">
	// Styling
	import './TextInput.scss';

	// Props
	export let label: string;
	export let subLabel: string = '';
	export let required = false;
	export let value: string = '';
	export let type: 'password' | 'text' = 'text';
	export let customClass: string = '';
</script>

<div class="text-input-container {customClass}">
	<label for={label.replace(' ', '-')}>
		{label}
		{#if subLabel !== ''}
			<span>{subLabel}</span>
		{/if}
	</label>
	<input name={label.replace(' ', '-')} {required} {...{ type }} bind:value />
</div>
