<script lang="ts">
	// Various
	import { browser } from '$app/environment';
	import ApiService from '$lib/services/api.service';
	import socket from '$lib/services/socket.service';
	import { getTimestamp } from '$lib/services/util.service';
	import { users } from '$lib/stores/UserStore';
	import type { User } from '$lib/types/prisma';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	// States
	let timeout: number | null;
	let userList: User[] = [];

	// Subscribe to users store
	users.subscribe((value) => (userList = value));

	// Fetch users
	const usersQuery = createQuery({
		queryKey: ['users'],
		queryFn: ApiService.fetchUserList,
		placeholderData: [],
		retry: 2,
	});

	// Save users after new api request
	$: {
		if ($usersQuery.status === 'success') {
			let data: User[] = [];

			$usersQuery.data.forEach((u: User) => {
				data.push({
					...u,
					online: u.lastSeen ? getTimestamp() - getTimestamp(u.lastSeen) < 2000 : false,
				});
			});

			users.set(data);
		}
	}

	// Start a timeout, to check if user still online after timeout
	$: {
		if (browser) {
			if (timeout) clearTimeout(timeout);

			timeout = setTimeout(() => {
				let updatedUsers = userList;
				let update = false;

				updatedUsers.forEach((u, key) => {
					if (u.online) {
						update = true;
						updatedUsers[key].online = updatedUsers[key].lastSeen
							? getTimestamp() - getTimestamp(updatedUsers[key].lastSeen) < 2000
							: false;
					}
				});

				if (update) users.set(updatedUsers);
			}, 5000);
		}
	}

	// Register user-online listener after mount was complete
	onMount(() => {
		// Only update lastSeen timestamp when user-online message arrives
		socket.on('user-online', (data: any) => {
			let index = userList.findIndex((u: any) => u.id === data.userId);

			if (index !== -1) {
				const updatedUsers = userList;
				updatedUsers[index].lastSeen = data.lastSeen;
				updatedUsers[index].online = updatedUsers[index].lastSeen
					? getTimestamp() - getTimestamp(updatedUsers[index].lastSeen) < 2000
					: false;

				users.set(updatedUsers);
			}
		});

		// Cleanup user-online listener after unmount
		return () => {
			socket.off('user-online');

			if (timeout) {
				clearTimeout(timeout);
			}
		};
	});
</script>

<slot></slot>
