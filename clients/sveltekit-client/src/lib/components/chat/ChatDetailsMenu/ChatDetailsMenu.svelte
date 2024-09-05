<script lang="ts">
	import { users } from '$lib/stores/UserStore';
	import type { Chat, User } from '$lib/types/prisma';
	import Avatar from '../Avatar/Avatar.svelte';
	import './ChatDetailsMenu.scss';
	import GroupAvatarContainer from './GroupAvatarContainer.svelte';
	import GroupTitleContainer from './GroupTitleContainer.svelte';

	export let chat: Chat;
	export let close: () => void;
	let userList: User[] = [];

	/**
	 * Creates a readable string from date object
	 * @param date
	 * @param format
	 * @returns
	 */
	const getReadableDate = (date = new Date(), format = 'hh:MM') => {
		const dateObj = new Date(date);

		if (
			dateObj.getDay() !== new Date().getDay() ||
			dateObj.getMonth() !== new Date().getMonth() ||
			dateObj.getFullYear() !== new Date().getFullYear()
		) {
			return new Date(date).format('dd.mm.yyyy um hh:MM');
		}
		return new Date(date).format(format);
	};

	// Close the menu on background click
	const closeMenu = (e: any) => {
		if (e.target.classList.contains('chat-details-menu-bg')) {
			close();
		}
	};

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
				<li>
					<Avatar img={userList.find((u) => u.id === cp.User.id)?.avatar} userId={cp.User.id} />
					<div class="basic-information">
						<span class="username">
							<span>{cp.User.username}</span>
							{#if cp.creator}
								<span class="creator">Inhaber</span>
							{/if}
						</span>
						<span class="online">
							{#if userList.find((u) => u.id === cp.User.id)?.online}
								Online
							{:else if userList.find((u) => u.id === cp.User.id)?.lastSeen}
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
