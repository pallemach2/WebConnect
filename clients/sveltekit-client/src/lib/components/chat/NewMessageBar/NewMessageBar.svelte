<script lang="ts">
	import './NewMessageBar.scss';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
	import { selectedChat } from '$lib/stores/SelectedChatStore';
	import type { Chat } from '$lib/types/prisma';
	import socket from '$lib/services/socket.service';
	import { QueryObserver } from '@tanstack/svelte-query';
	import QueryService from '$lib/services/query.service';

	let content = '';
	let selected: Chat | null = null;

	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });
	selectedChat.subscribe((chat) => (selected = chat));

	const sendMessage = () => {
		if (content !== '' && selected) {
			socket.emit('message-new', { chatId: selected.id, content }, () => {
				// TODO: implement message without refetching
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
