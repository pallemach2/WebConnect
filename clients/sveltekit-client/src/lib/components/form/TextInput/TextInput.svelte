<script lang="ts">
	import './TextInput.scss';

	export let label: string;
	export let subLabel: string = '';
	export let required = false;
	export let value: string = '';
	export let type: 'password' | 'text' = 'text';
	export let onChange: (e: string) => void = () => {};
	export let customClass: string = '';

	// Handle the click
	function handleClick(event: Event) {
		const { target } = event;
		if (target) onChange((target as HTMLInputElement).value);
	}
</script>

<div class={'text-input-container ' + customClass}>
	<label for={label.replace(' ', '-')}>
		{label}
		{#if subLabel !== ''}
			<span>{subLabel}</span>
		{/if}
	</label>
	<input name={label.replace(' ', '-')} {required} {...{ type }} bind:value on:input={handleClick} />
</div>
