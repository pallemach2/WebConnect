<script lang="ts">
	import { selectedChat } from '$lib/stores/SelectedChatStore';
	import type { Chat, Message } from '$lib/types/prisma';
	import { QueryObserver } from '@tanstack/svelte-query';
	import './ChatHistory.scss';
	import QueryService from '$lib/services/query.service';
	import MessageBubble from '../MessageBubble/MessageBubble.svelte';

	let selected: Chat | null = null;
	let messages: Message[] = [];
	let lastMessage: any = null;
	let isPending = false;

	// Scroll down to newest message
	const scrollToMessage = () => {
		if (lastMessage) {
			lastMessage.scrollIntoView();
		}
	};

	let observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });
	observer.subscribe((result) => {
		isPending = result.isPending;
	});

	selectedChat.subscribe((chat) => {
		selected = chat;

		if (chat) {
			messages = chat.Message.toReversed();
		}
	});

	// Scroll to message
	$: {
		lastMessage = lastMessage;
		scrollToMessage();
	}
</script>

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
