<script lang="ts">
	import { onMount } from 'svelte';
	import socket from '$lib/services/socket.service';
	import { createQuery } from '@tanstack/svelte-query';
	import ApiService from '$lib/services/api.service';
	import { chats } from '$lib/stores/ChatStore';
	import { selectedChat } from '$lib/stores/SelectedChatStore';
	import type { Chat } from '$lib/types/prisma';
	import QueryService from '$lib/services/query.service';

	const chatsQuery = createQuery(
		{
			queryKey: ['chats'],
			queryFn: ApiService.fetchChats,
			placeholderData: [],
			retry: 2,
		},
		QueryService.getQueryClient(),
	);

	// Get selected chat from store
	let selected: Chat | null = null;
	selectedChat.subscribe((value) => (selected = value));

	// Function to set selected chat
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

	// Connect on mount
	onMount(() => {
		socket.on('message-new', () => {
			// TODO: Implement new message without refetch
			$chatsQuery.refetch();
		});

		socket.on('message-seen', () => {
			// TODO: Implement new message without refetch
			$chatsQuery.refetch();
		});

		socket.on('message-delete', () => {
			// TODO: Implement new message without refetch
			$chatsQuery.refetch();
		});

		socket.on('message-edit', () => {
			// TODO: Implement new message without refetch
			$chatsQuery.refetch();
		});

		socket.on('chat-edit', () => {
			// TODO: Implement new message without refetch
			$chatsQuery.refetch();
		});

		socket.connect();
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
