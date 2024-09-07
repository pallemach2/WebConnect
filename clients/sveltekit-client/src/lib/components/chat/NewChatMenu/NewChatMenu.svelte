<script lang="ts">
	// Styling
	import './NewChatMenu.scss';

	// Components
	import ButtonInput from '$lib/components/form/ButtonInput/ButtonInput.svelte';
	import MessageBox from '$lib/components/form/MessageBox/MessageBox.svelte';
	import SubmitButtonInput from '$lib/components/form/SubmitButtonInput/SubmitButtonInput.svelte';
	import TextInput from '$lib/components/form/TextInput/TextInput.svelte';

	// Various
	import socket from '$lib/services/socket.service';
	import { QueryObserver } from '@tanstack/svelte-query';
	import QueryService from '$lib/services/query.service';

	// Props
	export let close: () => void;

	// States
	let name = '';
	let username = '';
	let message = '';

	// Register listener to chats query
	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });

	/**
	 * Create new chat via socket connection
	 */
	const newChat = () => {
		socket.emit('chat-new', { name: name, users: [username] }, (d: any) => {
			if (d) {
				message = 'Nutzer konnte nicht gefunden werden.';
			} else {
				$observer.refetch();
				close();
			}
		});
	};
</script>

<div class="new-chat-menu">
	<p>Chat erstellen</p>
	{#if message !== ''}
		<MessageBox type="error" {message} />
	{/if}
	<form on:submit|preventDefault={newChat}>
		<TextInput label="Chat Name" bind:value={name} />
		<TextInput label="Benutzer" bind:value={username} />
		<div class="action-container">
			<ButtonInput type="secondary" label="Abbrechen" onClick={close} />
			<SubmitButtonInput type="primary" label="Chat erstellen" />
		</div>
	</form>
</div>
