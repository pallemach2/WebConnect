<script lang="ts">
	import { QueryObserver } from '@tanstack/svelte-query';
	import './Sidebar.scss';
	import QueryService from '$lib/services/query.service';
	import SidebarActions from '../SidebarActions/SidebarActions.svelte';
	import Avatar from '../Avatar/Avatar.svelte';
	import type { Chat } from '$lib/types/prisma';
	import ChatPreviewItem from '../ChatPreviewItem/ChatPreviewItem.svelte';
	import { selectedChat } from '$lib/stores/SelectedChatStore';

	let searchTerm = '';
	let isPending = true;
	let selected: Chat | null;
	const observer = new QueryObserver(QueryService.getQueryClient(), { queryKey: ['chats'] });

	/**
	 * Returns list of chats in right order with search term applied
	 * @returns
	 */
	function getChatsList() {
		// Return all chats ordered by timestamp of last message
		if (searchTerm === '') {
			if (!$observer.data) return [];
			return ($observer.data as Chat[]).toSorted((c1, c2) => {
				const c1Value = c1.Message.length > 0 ? c1.Message[0].createdAt : c1.createdAt;
				const c2Value = c2.Message.length > 0 ? c2.Message[0].createdAt : c2.createdAt;

				return new Date(c2Value).getTime() - new Date(c1Value).getTime();
			});
		}

		let results: Chat[] = [];
		const regex = new RegExp(searchTerm, 'gi');

		($observer.data as Chat[]).forEach((chat) => {
			if (regex.test(chat.name || '')) {
				results.push(chat);
				return;
			}

			chat.ChatParticipant.forEach((cp) => {
				if (regex.test(cp.User.username)) {
					results.push(chat);
					return;
				}
			});
		});

		return results;
	}

	// Trigger search
	function handleSearch(event: CustomEvent<{ term: string }>) {
		searchTerm = event.detail.term;
	}

	// Set new chat selection
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
	});

	// Subscribe to selected chat store
	selectedChat.subscribe((chat) => (selected = chat));
</script>

{#if isPending}
	<div class="sidebar-container">
		<SidebarActions on:search={handleSearch} />
		<ul class="chat-preview-list">
			<li class={'chat-preview-item-container'}>
				<div class="main-container">
					<div class={'selected-marker hidden'}></div>
					<Avatar loading={true} />
					<div class="content-container">
						<div class="username loading"></div>
						<div class="message loading"></div>
					</div>
				</div>
			</li>
			<li class={'chat-preview-item-container'}>
				<div class="main-container">
					<div class={'selected-marker hidden'}></div>
					<Avatar loading={true} />
					<div class="content-container">
						<div class="username loading"></div>
						<div class="message loading"></div>
					</div>
				</div>
			</li>
			<li class={'chat-preview-item-container'}>
				<div class="main-container">
					<div class={'selected-marker hidden'}></div>
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
		<SidebarActions on:search={handleSearch} />
		<ul class="chat-preview-list">
			{#each getChatsList() as chat (chat.id)}
				<ChatPreviewItem {chat} selected={chat.id === selected?.id} on:select-chat={handleSelectChat} />
			{/each}
		</ul>
	</div>
{/if}
