<script lang="ts">
	// Styling
	import './Sidebar.scss';

	// Components
	import SidebarActions from '../SidebarActions/SidebarActions.svelte';
	import Avatar from '../Avatar/Avatar.svelte';
	import ChatPreviewItem from '../ChatPreviewItem/ChatPreviewItem.svelte';

	// Various
	import { QueryObserver } from '@tanstack/svelte-query';
	import QueryService from '$lib/services/query.service';
	import type { Chat } from '$lib/types/prisma';
	import { selectedChat } from '$lib/stores/SelectedChatStore';
	import { getChatsList } from '$lib/services/util.service';

	// States
	let searchTerm = '';
	let isPending = true;
	let selected: Chat | null;
	let visibleChats: Chat[] = [];
	let chats: Chat[] = [];

	// Listen to chats query state
	const observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });

	/**
	 * Set a new selected chat
	 * @param event
	 */
	function handleSelectChat(event: CustomEvent<{ id: string }>) {
		const index = ($observer.data as Chat[]).findIndex((chat: Chat) => {
			if (chat.id === event.detail.id) return true;
			return false;
		});

		if (index !== -1) selectedChat.set(($observer.data as Chat[])[index]);
	}

	// Subscribe to query
	observer.subscribe((result) => {
		isPending = result.isPending;
		chats = result.data as Chat[];
	});

	// Subscribe to selected chat store
	selectedChat.subscribe((chat) => (selected = chat));

	// Filter chatlist again after updates
	$: visibleChats = getChatsList(chats, searchTerm);
</script>

{#if isPending}
	<div class="sidebar-container">
		<SidebarActions bind:searchTerm />
		<ul class="chat-preview-list">
			<li class="chat-preview-item-container">
				<div class="main-container">
					<div class="selected-marker hidden"></div>
					<Avatar loading={true} />
					<div class="content-container">
						<div class="username loading"></div>
						<div class="message loading"></div>
					</div>
				</div>
			</li>
			<li class="chat-preview-item-container">
				<div class="main-container">
					<div class="selected-marker hidden"></div>
					<Avatar loading={true} />
					<div class="content-container">
						<div class="username loading"></div>
						<div class="message loading"></div>
					</div>
				</div>
			</li>
			<li class="chat-preview-item-container">
				<div class="main-container">
					<div class="selected-marker hidden"></div>
					<Avatar loading={true} />
					<div class="content-container">
						<div class="username loading"></div>
						<div class="message loading"></div>
					</div>
				</div>
			</li>
		</ul>
	</div>
{:else}
	<div class="sidebar-container">
		<SidebarActions bind:searchTerm />
		<ul class="chat-preview-list">
			{#each visibleChats as chat (chat.id)}
				<ChatPreviewItem {chat} selected={chat.id === selected?.id} on:select-chat={handleSelectChat} />
			{/each}
		</ul>
	</div>
{/if}
