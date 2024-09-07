<script lang="ts">
	// Styling
	import './ChatHeader.scss';

	// Components
	import Avatar from '../Avatar/Avatar.svelte';
	import ChatDetailsMenu from '../ChatDetailsMenu/ChatDetailsMenu.svelte';
	import LastSeen from '../LastSeen/LastSeen.svelte';

	// Various
	import { browser } from '$app/environment';
	import TokenService from '$lib/services/token.service';
	import { selectedChat } from '$lib/stores/SelectedChatStore';
	import { users } from '$lib/stores/UserStore';
	import type { Chat, ChatParticipant, User } from '$lib/types/prisma';
	import { getUsersMetaByParticipants } from '$lib/services/util.service';

	// States
	let userList: User[] = [];
	let selected: Chat | null = null;
	let image = '';
	let nameTemp = '';
	let isGroupChat = false;
	let isSingleChat = false;
	let isNormalChat = false;
	let chatDetailsMenu = false;
	let chatUsers: User[] = [];

	// Subscribe to stores
	users.subscribe((users) => (userList = users));
	selectedChat.subscribe((chat) => (selected = chat));

	$: if (browser && selected) {
		let self = TokenService.getUser();

		// Get userlist meta data and remove self
		chatUsers = getUsersMetaByParticipants((selected as Chat).ChatParticipant, userList);
		const index = chatUsers.findIndex((u) => u.id === self?.id);
		chatUsers = chatUsers.toSpliced(index, 1);

		// Determine chat type
		isGroupChat = chatUsers.length > 1;
		isSingleChat = chatUsers.length === 0;
		isNormalChat = chatUsers.length === 1;

		// Set variables if groupchat
		if (isGroupChat) {
			image = (selected as Chat).avatar || '';
			nameTemp = (selected as Chat).name as string;
		}

		// Set variables if 1:1 chat
		if (isNormalChat) {
			image = chatUsers[0].avatar as string;
			nameTemp = chatUsers[0].username;
		}

		// Set variables if only one member
		if (isSingleChat) {
			image = self?.avatar || '';
			nameTemp = (selected as Chat).name as string;
		}
	}
</script>

{#if selected !== null}
	<div class="chat-header-container" on:click={() => (chatDetailsMenu = true)}>
		<div class="user-information">
			<Avatar img={image} userId={isNormalChat ? chatUsers[0].id : undefined} />
			<div class="user-meta">
				<p class="username">{nameTemp}</p>
				<p class="last-seen">
					{#if chatUsers.length > 0}
						<LastSeen userId={chatUsers[0].id} usersCounter={chatUsers.length + 1} />
					{/if}
				</p>
			</div>
		</div>
	</div>
	{#if chatDetailsMenu}
		<ChatDetailsMenu chat={selected} close={() => (chatDetailsMenu = false)} />
	{/if}
{/if}
