<script lang="ts">
	// Various
	import { onMount } from 'svelte';
	import socket from '$lib/services/socket.service';
	import { createQuery } from '@tanstack/svelte-query';
	import ApiService from '$lib/services/api.service';
	import { chats } from '$lib/stores/ChatStore';
	import { selectedChat } from '$lib/stores/SelectedChatStore';
	import type { Chat } from '$lib/types/prisma';
	import QueryService from '$lib/services/query.service';

	// States
	let selected: Chat | null = null;

	// Register subscriber to selected chat store
	selectedChat.subscribe((value) => (selected = value));

	// Fetch chats
	const chatsQuery = createQuery(
		{
			queryKey: ['chats'],
			queryFn: ApiService.fetchChats,
			placeholderData: [],
			retry: 2,
		},
		QueryService.getQueryClient(),
	);

	/**
	 * Set selected chat by id
	 * @param id
	 */
	export function setSelectedChatById(id: string) {
		const index = $chatsQuery.data.findIndex((chat: Chat) => {
			if (chat.id === id) return true;
			return false;
		});

		if (index !== -1) selectedChat.set($chatsQuery.data[length]);
	}

	// Save data in store after fetch
	$: {
		if ($chatsQuery.status === 'success') {
			chats.set($chatsQuery.data);

			// Set selected chat, if no one selected, or update
			if (selected === null && $chatsQuery.data.length > 0) {
				selectedChat.set($chatsQuery.data[0]);
			} else if (selected !== null && $chatsQuery.data.length > 0) {
				const index = $chatsQuery.data.findIndex((chat: Chat) => {
					if (chat.id === selected?.id) return true;
					return false;
				});

				if (index !== -1) selectedChat.set($chatsQuery.data[index]);
			}
		}
	}

	// Register event listeners on mount and connect
	onMount(() => {
		socket.on('message-new', () => {
			$chatsQuery.refetch();
		});

		socket.on('message-seen', () => {
			$chatsQuery.refetch();
		});

		socket.on('message-delete', () => {
			$chatsQuery.refetch();
		});

		socket.on('message-edit', () => {
			$chatsQuery.refetch();
		});

		socket.on('chat-edit', () => {
			$chatsQuery.refetch();
		});

		socket.connect();

		// Disconnect on unmount and remove event listeners
		return () => {
			socket.off('message-new');
			socket.off('message-seen');
			socket.off('message-delete');
			socket.off('message-edit');
			socket.off('chat-edit');

			socket.disconnect();
		};
	});
</script>

<slot></slot>
