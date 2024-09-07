<script lang="ts">
	// Styling
	import './EditMenu.scss';

	// Components
	import ButtonInput from '$lib/components/form/ButtonInput/ButtonInput.svelte';

	// Various
	import QueryService from '$lib/services/query.service';
	import socket from '$lib/services/socket.service';
	import type { Message } from '$lib/types/prisma';
	import { QueryObserver } from '@tanstack/svelte-query';

	// Props
	export let message: Message;
	export let close: () => void;

	// States
	let value = message.content;

	// Register listener on chats query
	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });

	/**
	 * Close menu on background click
	 * @param e
	 */
	const closeMenu = (e: any) => {
		if (e.target.classList.contains('edit-menu-bg')) {
			close();
		}
	};

	/**
	 * Save new message content
	 */
	const save = () => {
		if (value !== '') {
			socket.emit('message-edit', { messageId: message.id, content: value }, () => {
				close();
				$observer.refetch();
			});
		}
	};
</script>

<div class="edit-menu-bg" on:click={closeMenu}>
	<div class="edit-menu-container">
		<p>Nachricht bearbeiten</p>
		<textarea bind:value />
		<div class="action-container">
			<ButtonInput type="secondary" label="Abbrechen" onClick={close} />
			<ButtonInput type="primary" label="Speichern" onClick={save} />
		</div>
	</div>
</div>
