<script lang="ts">
	import './CheckboxInput.scss';

	export let label: string;
	export let value: boolean = false;
	export let onChange: (x: boolean) => void = () => {};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="checkbox-input-container" on:click={() => onChange(!value)}>
	<label for={label.replace(' ', '-')}>{label}</label>
	<input type="checkbox" name={label.replace(' ', '-')} on:click={() => onChange(!value)} />
	<div class={'checkbox ' + (value && 'checked')}>
		{#if value}
			<div class="checked-marker"></div>
		{/if}
	</div>
</div>
