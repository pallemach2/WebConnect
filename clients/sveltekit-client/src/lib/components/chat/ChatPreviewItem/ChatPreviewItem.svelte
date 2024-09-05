<script lang="ts">
	import './ChatPreviewItem.scss';
	import { browser } from '$app/environment';
	import TokenService from '$lib/services/token.service';
	import type { Chat, ChatParticipant, Message } from '$lib/types/prisma';
	import { faCheckDouble, faCheck } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import Avatar from '../Avatar/Avatar.svelte';
	import { createEventDispatcher } from 'svelte';

	/**
	 * Checks if all users have read a message
	 * @param message
	 * @param chatParticipants
	 * @returns boolean
	 */
	const doubleTick = (message: Message, chatParticipants: ChatParticipant[]) => {
		return message.MessageSeen.length >= chatParticipants.length;
	};

	/**
	 * Check how many unread messages the user has in chat
	 * @param messages
	 * @param userId
	 * @returns number
	 */
	const getUnreadCounter = (messages: Message[], userId: string) => {
		let unread = 0;

		// Iterate over every message and its message seen entries and check if seen
		messages.forEach((message) => {
			const i = message.MessageSeen.findIndex((entry) => entry.ChatParticipant.userId === userId);
			if (i === -1) unread += 1;
		});

		return unread;
	};

	export let selected: boolean = false;
	export let chat: Chat;
	let lastMessage = null;
	let unreadCounter = 0;
	let content = '';
	let self = false;
	let timestamp = '';
	let participantsWithoutSelf: ChatParticipant[] = [];
	let isGroupChat = false;
	let isNormalChat = false;
	let isSingleChat = false;
	let image = '';
	let nameTemp = '';

	const dispatch = createEventDispatcher();

	if (browser) {
		// User and chat data
		const user = TokenService.getUser();
		let { ChatParticipant, avatar, name } = chat;

		// Get last message in Chat
		lastMessage = chat.Message.length > 0 ? chat.Message[0] : null;

		// Get counter of unread messages
		unreadCounter = getUnreadCounter(chat.Message, user.id);

		// Get Content of last message
		content = lastMessage ? lastMessage.content : '';

		// Is last message from self
		self = lastMessage ? lastMessage.ChatParticipant.User.id === user.id : false;

		// Timestamp of last message
		timestamp = lastMessage ? new Date(lastMessage.createdAt).format('hh:MM') : '';

		// Create array of all chat users without self
		participantsWithoutSelf = [];
		ChatParticipant.forEach((participant) => {
			if (user.id !== participant.User.id) participantsWithoutSelf.push(participant);
		});

		// Determine chat type
		isGroupChat = participantsWithoutSelf.length > 1;
		isSingleChat = participantsWithoutSelf.length === 0;
		isNormalChat = participantsWithoutSelf.length === 1;

		image = '';
		nameTemp = '';

		if (isGroupChat) {
			image = avatar || '';
			nameTemp = name as string;
		}

		if (isNormalChat) {
			image = participantsWithoutSelf[0].User.avatar as string;
			nameTemp = participantsWithoutSelf[0].User.username;
		}

		if (isSingleChat) {
			image = user.avatar;
			nameTemp = chat.name as string;
		}
	}
</script>

<li
	class="chat-preview-item-container {selected && 'selected'}"
	on:click={() => dispatch('select-chat', { id: chat.id })}
>
	<div class="main-container">
		<div class="selected-marker {!selected && 'hidden'}"></div>
		<Avatar img={image} userId={isNormalChat ? participantsWithoutSelf[0].User.id : undefined} />
		<div class="content-container">
			<p class="username">{nameTemp}</p>
			<p class="message">
				{#if self}
					<span class="sender">Du: </span>
				{/if}
				{#if isGroupChat && !self}
					<span class="sender">
						{lastMessage?.ChatParticipant.User.username}:{' '}
					</span>
				{/if}
				<span>
					{content.length > 50 ? content.substr(0, 40) + '...' : content}
				</span>
			</p>
		</div>
	</div>
	<div class="detail-container">
		<div class="timestamp">
			{#if self}
				<FontAwesomeIcon icon={lastMessage && doubleTick(lastMessage, chat.ChatParticipant) ? faCheckDouble : faCheck}
				></FontAwesomeIcon>
			{/if}
			<span>{timestamp}</span>
		</div>
		<span class="unread-counter {(unreadCounter === 0 || selected) && 'hidden'}">
			{unreadCounter}
		</span>
	</div>
</li>
