<script lang="ts">
	// Styling
	import './NewMessageBar.scss';

	// Components
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

	// Various
	import { selectedChat } from '$lib/stores/SelectedChatStore';
	import type { Chat } from '$lib/types/prisma';
	import socket from '$lib/services/socket.service';
	import { QueryObserver } from '@tanstack/svelte-query';
	import QueryService from '$lib/services/query.service';

	// States
	let content = '';
	let selected: Chat | null = null;

	// Listen to selected store
	selectedChat.subscribe((chat) => (selected = chat));

	// Register listener to chats query
	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });

	/**
	 * Do send message action
	 */
	const sendMessage = () => {
		if (content !== '' && selected) {
			socket.emit('message-new', { chatId: selected.id, content }, () => {
				$observer.refetch();
			});

			// Reset field value
			content = '';
		}
	};
</script>

<div class="new-message-bar-container">
	<div class="input-container">
		<input
			type="textfield"
			bind:value={content}
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					sendMessage();
				}
			}}
		/>
		<button on:click={sendMessage}>
			<FontAwesomeIcon icon={faPaperPlane} />
		</button>
	</div>
</div>
