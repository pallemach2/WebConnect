<script lang="ts">
	import './MessageBox.scss';

	export let type: 'error' | 'success' | 'warning';
	export let message: string;
	let title = 'Nachricht';
	let className = 'success';

	$: {
		if (type === 'error') {
			title = 'Fehler';
			className = 'error';
		}

		if (type === 'warning') {
			title = 'Hinweis';
			className = 'warning';
		}
	}
</script>

{#if message !== ''}
	<div class="message-box-container {className}">
		<p class="title">{title}</p>
		<div class="message">
			<p>{message}</p>
		</div>
	</div>
{/if}
