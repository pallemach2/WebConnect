<script lang="ts">
	// Styling
	import './ChatHistory.scss';

	// Components
	import MessageBubble from '../MessageBubble/MessageBubble.svelte';

	// Various
	import { selectedChat } from '$lib/stores/SelectedChatStore';
	import { QueryObserver } from '@tanstack/svelte-query';
	import QueryService from '$lib/services/query.service';
	import { browser } from '$app/environment';
	import TokenService from '$lib/services/token.service';
	import socket from '$lib/services/socket.service';
	import type { Chat, Message } from '$lib/types/prisma';
	import { scrollToMessage } from '$lib/services/util.service';

	// States
	let selected: Chat | null = null;
	let messages: Message[] = [];
	let lastMessage: any = null;
	let isPending = false;
	let focus = false;
	let user = null;

	// Register listener to chats query
	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });

	// Subscribe to query changes
	observer.subscribe((result) => {
		isPending = result.isPending;
	});

	// Subscribe to selected chat store
	selectedChat.subscribe((chat) => {
		selected = chat;

		if (chat) {
			messages = chat.Message.toReversed();
		}
	});

	// Get user and focus state after mount
	if (browser) {
		user = TokenService.getUser();
		focus = document.hasFocus();
	}

	// Scroll to newest message
	$: scrollToMessage(lastMessage);

	// Send read state for all new messages in view, if focus is true
	$: if (selected && focus) {
		let setRead: string[] = [];

		// Check all messages if user has not seen them yet
		selected.Message.forEach((message) => {
			const i = message.MessageSeen.findIndex((ms: any) => ms.ChatParticipant.userId === user?.id);

			if (i === -1) setRead.push(message.id);
		});

		if (setRead.length > 0) {
			socket.emit('message-seen', { messageIds: setRead }, () => {
				$observer.refetch();
			});
		}
	}
</script>

<svelte:window on:focus={() => (focus = true)} on:blur={() => (focus = false)} />
{#if isPending}
	<div class="chat-history-container">
		<div class="message-container {Math.random() > 0.5 && 'self'}">
			<div
				class="message-bubble loading"
				style:height="{60 + Math.random() * 100}px"
				style:width="{200 + Math.random() * 100}px"
			></div>
		</div>
		<div class="message-container {Math.random() > 0.5 && 'self'}">
			<div
				class="message-bubble loading"
				style:height="{60 + Math.random() * 100}px"
				style:width="{200 + Math.random() * 100}px"
			></div>
		</div>
		<div class="message-container {Math.random() > 0.5 && 'self'}">
			<div
				class="message-bubble loading"
				style:height="{60 + Math.random() * 100}px"
				style:width="{200 + Math.random() * 100}px"
			></div>
		</div>
		<div class="message-container {Math.random() > 0.5 && 'self'}">
			<div
				class="message-bubble loading"
				style:height="{60 + Math.random() * 100}px"
				style:width="{200 + Math.random() * 100}px"
			></div>
		</div>
		<div class="message-container {Math.random() > 0.5 && 'self'}">
			<div
				class="message-bubble loading"
				style:height="{60 + Math.random() * 100}px"
				style:width="{200 + Math.random() * 100}px"
			></div>
		</div>
		<div class="message-container {Math.random() > 0.5 && 'self'}">
			<div
				class="message-bubble loading"
				style:height="{60 + Math.random() * 100}px"
				style:width="{200 + Math.random() * 100}px"
			></div>
		</div>
		<div class="message-container {Math.random() > 0.5 && 'self'}">
			<div
				class="message-bubble loading"
				style:height="{60 + Math.random() * 100}px"
				style:width="{200 + Math.random() * 100}px"
			></div>
		</div>
	</div>
{:else if selected}
	<div class="chat-history-container">
		{#each messages as message, key}
			<MessageBubble
				bind:component={lastMessage}
				{message}
				nextMessage={messages[key + 1] || null}
				previousMessage={messages[key - 1] || null}
				participants={selected.ChatParticipant}
			/>
		{/each}
	</div>
{/if}
