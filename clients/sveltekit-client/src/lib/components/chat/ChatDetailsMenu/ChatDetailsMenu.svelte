<script lang="ts">
	// Styling
	import './ChatDetailsMenu.scss';

	// Components
	import Avatar from '../Avatar/Avatar.svelte';
	import GroupAvatarContainer from './GroupAvatarContainer.svelte';
	import GroupTitleContainer from './GroupTitleContainer.svelte';

	// Various
	import { users } from '$lib/stores/UserStore';
	import type { Chat, User } from '$lib/types/prisma';
	import { getReadableDate } from '$lib/services/util.service';

	// Props
	export let chat: Chat;
	export let close: () => void;

	// States
	let userList: User[] = [];

	// Close the menu on background click
	const closeMenu = (e: any) => {
		if (e.target.classList.contains('chat-details-menu-bg')) {
			close();
		}
	};

	// Subscribe to users store
	users.subscribe((users) => (userList = users));
</script>

<div class="chat-details-menu-bg" on:click={closeMenu}>
	<div class="chat-details-menu-container">
		<GroupAvatarContainer chatId={chat.id} src={chat.avatar || 'clzmp4jk80000nudqn6vmauc4.jpg'} />
		<div class="title-container">
			<GroupTitleContainer chatId={chat.id} name={chat.name || ''} memberCount={chat.ChatParticipant.length} />
		</div>
		<ul class="members">
			{#each chat.ChatParticipant as cp (cp.id)}
				{@const foundUser = userList.find((u) => u.id === cp.User.id)}
				<li>
					<Avatar img={foundUser?.avatar} userId={cp.User.id} />
					<div class="basic-information">
						<span class="username">
							<span>{cp.User.username}</span>
							{#if cp.creator}
								<span class="creator">Inhaber</span>
							{/if}
						</span>
						<span class="online">
							{#if foundUser?.online}
								Online
							{:else if foundUser?.lastSeen}
								{#each userList as user}
									{#if user.id === cp.User.id && user.lastSeen}
										zul. online: {getReadableDate(user.lastSeen)}
									{/if}
								{/each}
							{:else}
								zul. online: Nie
							{/if}
						</span>
					</div>
					<div class="actions"></div>
				</li>
			{/each}
		</ul>
	</div>
</div>
